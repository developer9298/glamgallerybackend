const Order = require("../Order/OrderModel");
const Product = require('../Product/ProductModel');
const Cart = require("../Cart/CartModel")
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

console.log("✅ PayPal Client ID loaded:", process.env.PAYPAL_CLIENT_ID ? "YES" : "NO");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paypalOrderId,
    } = req.body;

    // 1️⃣ Basic Validation
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.json({
        status: 422,
        success: false,
        message: "Invalid order data. Please include userId and items array.",
      });
    }

    // 2️⃣ Validate each productId
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.json({
          status: 400,
          success: false,
          message: `Invalid product ID: ${item.productId}`,
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.json({
          status: 404,
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      // Optional stock check
      if (product.quantity < item.quantity) {
        return res.json({
          status: 400,
          success: false,
          message: `Not enough stock for product: ${product.name}`,
        });
      }
    }

    // 3️⃣ Handle PayPal Verification (if PayPal method)
    let paymentStatus = "Pending";

    if (paymentMethod === "PayPal") {
      if (!paypalOrderId) {
        return res.json({
          status: 400,
          success: false,
          message: "Missing PayPal Order ID.",
        });
      }

      try {
        // 🔹 1. Get PayPal Access Token
        const tokenRes = await axios({
          url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
              ).toString("base64"),
          },
          data: "grant_type=client_credentials",
        });

        const accessToken = tokenRes.data.access_token;

        // 🔹 2. Verify the PayPal Order
        const verifyRes = await axios.get(
          `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const paypalStatus = verifyRes.data.status;

        if (paypalStatus !== "COMPLETED") {
          return res.json({
            status: 400,
            success: false,
            message: "PayPal payment not completed or invalid.",
            paypalStatus,
          });
        }

        paymentStatus = "Paid";
      } catch (err) {
        console.error(
          "PayPal Verification Error:",
          err.response?.data || err.message
        );
        return res.json({
          status: 500,
          success: false,
          message: "Failed to verify PayPal payment.",
          error: err.message,
        });
      }
    }

    // 4️⃣ Create new order
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus,
      paypalOrderId: paypalOrderId || null,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    // 5️⃣ Optionally clear user cart
    await Cart.deleteMany({ userId });

    // 6️⃣ Send response
    res.json({
      status: 200,
      success: true,
      message:
        paymentMethod === "PayPal"
          ? "✅ Order placed successfully with PayPal payment!"
          : "✅ Order placed successfully (Cash on Delivery)!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// // ✅ Create New Order
// const createOrder = async (req, res) => {
//   try {
//     const { userId, items, shippingAddress, totalAmount } = req.body;

//     // 1️⃣ Validation
//     if (!userId || !items || !Array.isArray(items) || items.length === 0) {
//       return res.json({
//         status: 422,
//         success: false,
//         message: "Invalid order data. Please include userId and items array.",
//       });
//     }

//     // 2️⃣ Validate each productId
//     for (const item of items) {
//       if (!mongoose.Types.ObjectId.isValid(item.productId)) {
//         return res.json({
//           status: 400,
//           success: false,
//           message: `Invalid product ID: ${item.productId}`,
//         });
//       }

//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.json({
//           status: 404,
//           success: false,
//           message: `Product not found: ${item.productId}`,
//         });
//       }

//       // optional: check quantity
//       if (product.quantity < item.quantity) {
//         return res.json({
//           status: 400,
//           success: false,
//           message: `Not enough stock for product: ${product.name}`,
//         });
//       }
//     }

//     // 3️⃣ Create new order
//     const newOrder = new Order({
//       userId,
//       items,
//       shippingAddress,
//       totalAmount,
//       status: "Pending",
//       createdAt: new Date(),
//     });

//     await newOrder.save();

//     res.json({
//       status: 200,
//       success: true,
//       message: "Order created successfully!",
//       data: newOrder,
//     });
//   } catch (error) {
//     res.json({
//       status: 500,
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };



// ✅ Get All Orders
const getOrders = async (req, res) => {
  const total = await Order.find(req.body).countDocuments()
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId");

    res.json({
      status: 200,
      success: true,
      total:total,
      message: "Orders loaded successfully",
      data: orders,
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ✅ Get Single Order
const getSingleOrder = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({
        status: 422,
        success: false,
        message: "_id is required",
      });
    }

    const order = await Order.findById(_id)
      .populate("userId")
      .populate("items.productId");

    if (!order) {
      return res.json({
        status: 404,
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      status: 200,
      success: true,
      message: "Order loaded successfully",
      data: order,
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ✅ Update Order Status
const updateOrderStatus = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id || !status) {
    return res.json({
      status: 422,
      success: false,
      message: "_id and status are required",
    });
  }

  try {
    const order = await Order.findById(_id);

    if (!order) {
      return res.json({
        status: 404,
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      status: 200,
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ✅ Delete Order
const deleteOrder = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.json({
      status: 422,
      success: false,
      message: "_id is required",
    });
  }

  try {
    const deleted = await Order.findByIdAndDelete(_id);

    if (!deleted) {
      return res.json({
        status: 404,
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      status: 200,
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.params?.userId || req.body?.userId;

    console.log("clearCart called. req.params:", req.params, "req.body:", req.body);

    if (!userId) {
      console.warn("clearCart: missing userId");
      return res.json({
        status: 422,
        success: false,
        message: "userId is required",
      });
    }

    const deletedCart = await Cart.deleteMany({ userId });

    console.log("clearCart: deletedCount =", deletedCart.deletedCount);

    return res.json({
      status: 200,
      success: true,
      message: deletedCart.deletedCount
        ? "Cart cleared successfully"
        : "Cart was already empty",
      deletedCount: deletedCart.deletedCount,
    });
  } catch (err) {
    console.error("clearCart error:", err);
    return res.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,clearCart
};
