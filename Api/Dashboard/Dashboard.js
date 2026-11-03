const user = require('..//Users/UserModel')
const catagory = require('../Catagory/CatagoryModel')
const product = require('../Product/ProductModel')
const order = require('../Order/OrderModel')
const dashboard = async (req, res) => {

    const totalcustomers = await user.find({userType:2}).countDocuments().exec()
    const totaladmin = await user.find({userType:1}).countDocuments().exec()
    const totalCategory = await catagory.countDocuments().exec()
    const totalProduct = await product.countDocuments().exec()
    const totalOrder = await order.countDocuments().exec()


    res.json({
        status: 200,
        success: true,
        message: "Dashboard Laoded",
        users:{
            totalAdmin: totaladmin,
            totalCustomers: totalcustomers
        },
        totalCategory: totalCategory,
        totalProduct: totalProduct,
        totalOrders:totalOrder
    })
}

const dashboard2 = async (req, res) => {

    const totalcustomers = await user.find({userType:2}).countDocuments().exec()
    const totaladmin = await user.find({userType:1}).countDocuments().exec()
    const totalCategory = await catagory.countDocuments().exec()
    const totalProduct = await product.countDocuments().exec()


    res.json({
        status: 200,
        success: true,
        message: "Dashboard Laoded",
        users:{
            totalAdmin: totaladmin,
            totalCustomers: totalcustomers
        },
        totalCategory: totalCategory,
        totalProduct: totalProduct
    })
}


module.exports = {
    dashboard,
    dashboard2
}