const mongoose = require('mongoose')
const ProductModel = mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: '' },
    shape: { type: String, default: '' },
    image: {type: [String],default: [],},
    productCode: { type: String, default: '' },
    size: { type: String, default: '' },
    quantity: { type: Number, default: '0' },
    catagoryId: { type: mongoose.Schema.Types.ObjectId, ref: "catagory" },
    availability: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }

})
module.exports = new mongoose.model('product', ProductModel)