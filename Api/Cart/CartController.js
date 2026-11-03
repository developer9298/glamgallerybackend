const Cart = require('./CartModel');
const Product = require('../Product/ProductModel');
const mongoose = require("mongoose");
const addToCart = async (req, res) => {
    const validationError = [];

    if (!req.body.productId)
        validationError.push("productId is required");

    if (!req.body.quantity)
        validationError.push("quantity is required");

    if (validationError.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: "Validation Error",
            errors: validationError
        });
    }

    try {
        let product;

      
        if (mongoose.Types.ObjectId.isValid(req.body.productId)) {
            product = await Product.findById(req.body.productId);
        } else {
           
            product = await Product.findOne({ productCode: req.body.productId });
        }

        if (!product) {
            return res.json({
                status: 404,
                success: false,
                message: "Product not found"
            });
        }

       
        const userId = req.body.userId || null;

       
        const existingCartItem = await Cart.findOne({
            userId,
            productId: product._id,
            size: req.body.size
        });

        if (existingCartItem) {
            existingCartItem.quantity += parseInt(req.body.quantity);
            await existingCartItem.save();

            return res.json({
                status: 200,
                success: true,
                message: "Cart updated successfully",
                data: existingCartItem
            });
        }

      
        const cartItem = new Cart({
            userId,
            productId: product._id,
            quantity: req.body.quantity,
            size: req.body.size,
            price:req.body.price
        });

        const savedItem = await cartItem.save();

        res.json({
            status: 200,
            success: true,
            message: "Product added to cart successfully",
            data: savedItem
        });

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            errors: err.message
        });
    }
};

const getCart = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.json({
        status: 422,
        success: false,
        message: "userId is required",
      });
    }

    const cartItems = await Cart.find({ userId }).populate("productId", "name image price");

    res.json({
      status: 200,
      success: true,
      message: "Cart loaded successfully",
      totalItems: cartItems.length,
      data: cartItems,
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};



const removeFromCart = async (req, res) => {
    const validationError = [];
    if (!req.body._id)
        validationError.push("_id is required");

    if (validationError.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: "Validation Error",
            errors: validationError
        });
    }

    try {
        const deleted = await Cart.findByIdAndDelete(req.body._id);

        if (!deleted) {
            return res.json({
                status: 404,
                success: false,
                message: "Cart item not found"
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "Item removed from cart successfully"
        });
    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            errors: err.message
        });
    }
};


module.exports = { addToCart, getCart, removeFromCart };
