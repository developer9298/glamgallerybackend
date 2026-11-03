const router = require("express").Router()
const productController = require("../Api/Product/ProductController")
const catagoryController = require("../Api/Catagory/CatagoryController")
const customerController = require("../Api/Customer/CustomerController")
const userController = require("../Api/Users/UserController")
const cartController = require("../Api/Cart/CartController")
const orderController = require("../Api/Order/OrderController")

const dashboardController = require("../Api/Dashboard/Dashboard")

const multar = require('multer')
const storage = multar.memoryStorage()
const upload = multar({ storage }) 


router.post("/login", userController.login)
router.post("/customer/add", customerController.addCustomer)
router.post("/catagory/get",catagoryController.GetCatagory)

router.post("/product/get",productController.getProduct)



//Product
router.post("/product/add",upload.array('image',10),productController.AddProduct)
router.post("/product/get",productController.getProduct)
router.post("/product/delete",productController.deleteProduct)
router.post("/product/update",upload.array('image',10),productController.updateProduct)
router.post("/product/single",productController.singleProduct)
router.post("/product/changeStatus",productController.changeStatus)

//Catagory
router.post("/catagory/add",upload.single('image'),catagoryController.AddCatagory)
router.post("/catagory/get",catagoryController.GetCatagory)
router.post("/catagory/delete",catagoryController.deleteCatagory)
router.post("/catagory/update",catagoryController.updateCatagory)
router.post("/catagory/single",catagoryController.singleCatagory)
router.post("/catagory/changeStatus",catagoryController.changeStatus)


//customer
router.post("/customer/single", customerController.singleCustomer)
router.post("/customer/editProfile", customerController.updateCustomer)

//cart
router.post("/cart/add", cartController.addToCart)
router.post("/cart/get", cartController.getCart)
router.post("/cart/remove", cartController.removeFromCart)


//order
router.post("/order/add", orderController.createOrder);
router.post("/order/get", orderController.getOrders);
router.post("/order/single", orderController.getSingleOrder);
router.post("/order/update-status", orderController.updateOrderStatus);
router.post("/order/delete", orderController.deleteOrder);
router.post("/clear/:userId", orderController.clearCart);




router.post('/dashboard', dashboardController.dashboard)



router.use(require("../utility/MiddleWare"))


module.exports = router

