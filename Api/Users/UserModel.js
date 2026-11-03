const mongoose = require("mongoose")
const userModel = mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    userType: { type: Number, default: 2 },//2-user
    status: { type: Boolean, default: true },
     
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model('users',userModel)