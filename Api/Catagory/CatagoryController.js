const Catagory = require('./CatagoryModel')
const { uploadImage } = require('../../utility/helper')
const Product = require("../Product/ProductModel");

const AddCatagory = (req, res) => {
    const validationError = []

    if (!req.body.catagoryCode)
        validationError.push("Catagory Code is required")

    if (!req.body.name)
        validationError.push("Catagory name is required")

    if (!req.file)
        validationError.push("Catagory image is required")

    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: 'Please Enter Details',
            errors: validationError
        })
    }

    else {
        Catagory.findOne({name:req.body.name })
            .then(async catagoryData => {
                if (catagoryData == null) {
                    const cataobj = new Catagory()
                    cataobj.catagoryCode = req.body.catagoryCode
                    cataobj.name = req.body.name
                    if (req.file) {
                        let url = await uploadImage(req.file.buffer)
                        cataobj.image = url
                    }
                    cataobj.save()
                        .then((result) => {
                            console.log(result)
                            res.json({
                                message: "Catagory Added Successfully",
                                success: true,
                                statusCode: 200,
                                data: result
                            })
                        })
                        .catch(err => {
                            res.json({
                                message: "Internal Server Error",
                                success: false,
                                status: 500,
                                data: err.message
                            })
                        })
                }
                else {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Catagory  name has already exist"
                    })
                }
            })
            .catch(err => {
                res.json({
                    message: "Internal Server Error",
                    success: false,
                    status: 500,
                    data: err.message
                })
            })

    }


}
// const GetCatagory = async (req,res)=>{
//      const total = await Catagory.find(req.body).countDocuments()
//      Catagory.find(res.body)
//         .then((getData) => {
            
//             res.json({
//                 message: "Catagory loaded succesfully",
//                 status: 200,
//                 success: true,
//                 total: total,
//                 data: getData
//             })
//         })
//         .catch(err => {
//             res.json({
//                 message: "Internal server error",
//                 status: 500,
//                 success: false,
//                 data: err.message
//             })
//         })
// }
const GetCatagory = async (req, res) => {
  try {
    const categoriesWithCount = await Catagory.aggregate([
      {
        $lookup: {
          from: "products", 
          localField: "_id",
          foreignField: "catagoryId",
          as: "products"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },
      {
        $project: {
          products: 0 
        }
      }
    ]);

    res.json({
      message: "Categories loaded successfully",
      status: 200,
      success: true,
      data: categoriesWithCount
    });
  } catch (err) {
    res.json({
      message: "Internal Server Error",
      status: 500,
      success: false,
      data: err.message
    });
  }
};
const singleCatagory = (req, res) => {
    validationError = [];
    if (!req.body._id) {
        validationError.push("_id is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation Error",
            errors: validationError

        })
    }
    else {
        Catagory.findOne({ _id: req.body._id })
            .then((catagoryData) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Catagory Loaded",
                    data: catagoryData

                })
            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    data: err.message

                })
            })
    }



}
const updateCatagory = (req, res) => {
    validationError = [];

    if (!req.body._id) {
        validationError.push("_id is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation Error",
            errors: validationError
        })
    }

    else {
        Catagory.findOne({ _id: req.body._id })
            .then(async myData => {
                if (!!myData) {

                    if (req.body.name)
                        myData.name = req.body.name
                    
                    if (req.body.catagoryCode)
                        myData.catagoryCode = req.body.catagoryCode
                    
                    myData.save()
                        .then(productData => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Data Updated Succesfully",
                                data: productData
                            })
                        })
                        .catch(err => {
                            res.json({
                                status: 422,
                                success: false,
                                message: "Internal Server Error",
                                data: err.message
                            })
                        })
                }
                else {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Record Not Found",

                    })
                }
            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    errors: err.message
                })
            })
    }
}

const deleteCatagory = (req, res) => {
    validationError = [];
    if (!req.body._id) {
        validationError.push("_id is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation Error",
            errors: validationError
        })
    }
    else {
        Catagory.findOne({ _id: req.body._id })
            .then(myData => {
                if (!!myData) {
                    myData.deleteOne({ _id: req.body._id })
                        .then(result => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Catagory Deleteed ",
                                data: result
                            })

                        })
                        .catch(err => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Internal Server Error ",
                                errors: err.message
                            })
                        })
                }
                else {
                    res.json({
                        status: 422,
                        success: false,
                        message: "Record Not Found",

                    })
                }


            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error ",
                    errors: err.message
                })
            })
    }
}
const changeStatus = (req, res) => {

    const validationError = []

    if (!req.body._id)
        validationError.push("_id is required")

    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation error",
            errors: validationError
        })
    }
    else {
        Catagory.findOne({ _id: req.body._id })
            .then(categoryData => {
                if (!!categoryData) {
                    
                        categoryData.status = req.body.status

                    categoryData.save()
                        .then(updateRes => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Status has been changed",
                                data: updateRes
                            })
                        })
                        .catch(err => {
                            res.json({
                                status: 422,
                                success: false,
                                message: "Internal server error",
                                errors: err.message
                            })
                        })
                }
                else {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Record not found"
                    })
                }

            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errors: err.message
                })
            })
    }
}
module.exports = { AddCatagory,GetCatagory,updateCatagory,deleteCatagory,singleCatagory,changeStatus }









