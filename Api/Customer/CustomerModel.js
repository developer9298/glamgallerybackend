const mongoose = require("mongoose")
const customerModel = mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    contact: { type: Number, default: '' },
    address: { type: String, default: '' },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model('customer',customerModel)