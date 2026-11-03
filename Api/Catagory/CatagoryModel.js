const mongoose = require('mongoose')
const CatagoryModel = mongoose.Schema({
    catagoryCode: { type: String, default: '' },
    name: { type: String, default: '' },
        image :{ type :String,default:''},

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})
module.exports = new mongoose.model('catagory',CatagoryModel)

