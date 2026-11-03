const Product = require('./ProductModel')
const { uploadImage } = require('../../utility/helper')
const AddProduct = (req, res) => {
    console.log(req.file)

    // console.log("dnfb")
    const validationError = []

    if (!req.body.name)
        validationError.push("Product Name is required")

    if (!req.body.productCode)
        validationError.push("Product Code  is required")

    if (!req.body.description)
        validationError.push("Product Description is required")

    if (!req.body.price)
        validationError.push("Product Price is required")
    if (!req.body.size)
        validationError.push("Product size is required")
    if (!req.body.quantity)
        validationError.push("Product quantity is required")
    // if (!req.file)
    //     validationError.push("Product img is required")
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Please Fill the Details",
            errors: validationError
        })
    }
    else {
        Product.findOne({ productCode: req.body.productCode })
            .then(async productData => {
                console.log(productData)
                if (productData == null) {
                    const productObj = new Product()

                    productObj.name = req.body.name,
                        productObj.catagoryId = req.body.catagoryId,

                        productObj.description = req.body.description
                    productObj.productCode = req.body.productCode
                    productObj.shape = req.body.shape
                    productObj.price = req.body.price
                    productObj.size = req.body.size
                    productObj.availability = req.body.availability
                    productObj.quantity = req.body.quantity
                    if (req.file) {
                        let url = await uploadImage(req.file.buffer)
                        productObj.image = url
                    }

                    if (req.files && req.files.length > 0) {
                        let urls = [];

                        for (const file of req.files) {
                            const url = await uploadImage(file.buffer); // call your upload function for each file
                            urls.push(url);
                        }

                        productObj.image = urls; // store array of URLs
                    }
                    productObj.save()
                        .then((result) => {
                            // console.log(result)
                            res.json({
                                message: "Product Added Successfully",
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
                        message: "Product Code has already exist"
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
const getProduct = async (req, res) => {
    const total = await Product.find(req.body).countDocuments()
    Product.find(res.body).populate('catagoryId')

        .then((getData) => {

            res.json({
                message: "Product loaded succesfully",
                status: 200,
                success: true,
                total: total,
                data: getData
            })
        })
        .catch(err => {
            res.json({
                message: "Internal server error",
                status: 500,
                success: false,
                data: err.message
            })
        })
}
const singleProduct = (req, res) => {
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
        Product.findOne({ _id: req.body._id }).populate('catagoryId')
            .then((catagoryData) => {
                res.json({
                    status: 200,
                    success: true,
                    message: "Product Loaded",
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
// const updateProduct = (req, res) => {
//     validationError = [];

//     if (!req.body._id) {
//         validationError.push("_id is required")
//     }
//     if (validationError.length > 0) {
//         res.json({
//             status: 422,
//             success: false,
//             message: "Validation Error",
//             errors: validationError
//         })
//     }

//     else {
//         Product.findOne({ _id: req.body._id }).populate('catagoryId')
//             .then(async myData => {
//                 if (!!myData) {

//                     if (req.body.name)
//                         myData.name = req.body.name
//                     if (req.body.description)
//                         myData.description = req.body.description

//                     if (req.body.price)
//                         myData.price = req.body.price
//                       if (req.body.productCode)
//                         myData.productCode = req.body.productCode
//                       if (req.body.size)
//                         myData.size = req.body.size

//                     if (req.body.quantity)
//                         myData.quantity = req.body.quantity
//      if (req.file) {
//                         let url = await uploadImage(req.file.buffer)
//                         myData.image = url
//                     }

//                     if (req.files && req.files.length > 0) {
//                         let urls = [];

//                         for (const file of req.files) {
//                             const url = await uploadImage(file.buffer);
//                             urls.push(url);
//                         }

//                         myData.image = urls; 
//                     }
//                     myData.save()
//                         .then(productData => {
//                             res.json({
//                                 status: 200,
//                                 success: true,
//                                 message: "Data Updated Succesfully",
//                                 data: productData
//                             })
//                         })
//                         .catch(err => {
//                             res.json({
//                                 status: 422,
//                                 success: false,
//                                 message: "Internal Server Error",
//                                 data: err.message
//                             })
//                         })
//                 }
//                 else {
//                     res.json({
//                         status: 404,
//                         success: false,
//                         message: "Record Not Found",

//                     })
//                 }
//             })
//             .catch(err => {
//                 res.json({
//                     status: 500,
//                     success: false,
//                     message: "Internal Server Error",
//                     errors: err.message
//                 })
//             })
//     }
// }
const updateProduct = (req, res) => {
  let validationError = [];

  // ✅ Support both FormData and JSON
  const productId = req.body?._id || req.params?.id;

  if (!productId) {
    validationError.push("_id is required");
  }

  if (validationError.length > 0) {
    return res.json({
      status: 422,
      success: false,
      message: "Validation Error",
      errors: validationError,
    });
  }

  Product.findOne({ _id: productId })
    .populate("catagoryId")
    .then(async (myData) => {
      if (!!myData) {
        // ✅ Update fields safely
        if (req.body.name) myData.name = req.body.name;
        if (req.body.description) myData.description = req.body.description;
        if (req.body.price) myData.price = req.body.price;
        if (req.body.productCode) myData.productCode = req.body.productCode;
        if (req.body.size) myData.size = req.body.size;
        if (req.body.quantity) myData.quantity = req.body.quantity;
        if (req.body.catagoryId) myData.catagoryId = req.body.catagoryId;
        if (req.body.availability) myData.availability = req.body.availability;

        // ✅ handle image uploads
        if (req.files && req.files.length > 0) {
          let urls = [];
          for (const file of req.files) {
            const url = await uploadImage(file.buffer);
            urls.push(url);
          }
          myData.image = urls;
        }

        // ✅ Save and respond
        myData
          .save()
          .then((productData) => {
            res.json({
              status: 200,
              success: true,
              message: "Product Updated Successfully",
              data: productData,
            });
          })
          .catch((err) => {
            res.json({
              status: 500,
              success: false,
              message: "Internal Server Error",
              data: err.message,
            });
          });
      } else {
        res.json({
          status: 404,
          success: false,
          message: "Record Not Found",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        errors: err.message,
      });
    });
};


const deleteProduct = (req, res) => {
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
        Product.findOne({ _id: req.body._id })
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
        Product.findOne({ _id: req.body._id })
            .then(data => {
                
                if (!!data) {
                   
                        data.status = req.body.status

                    data.save()
                        .then(result => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Status has been changed",
                                data: result
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
module.exports = { AddProduct, getProduct, deleteProduct, singleProduct, updateProduct ,changeStatus}
