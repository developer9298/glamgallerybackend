const Customer = require('../Customer/CustomerModel')
const bcrypt = require('bcrypt')
const saltround = 10;
const user = require('../Users/UserModel')
const addCustomer = (req, res) => {
    console.log(req.body)
    validationError = [];
    if (!req.body.name) {
        validationError.push("name is required")
    }
    if (!req.body.email) {
        validationError.push("email is required")
    }
    if (!req.body.contact) {
        validationError.push("contact number is required")
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
        user.findOne({ email: req.body.email })
        .then(userdata => {
            if (userdata == null) {
                const userObj = new user()
                userObj.name = req.body.name
                userObj.email = req.body.email
                userObj.password = bcrypt.hashSync(req.body.password, saltround)
                userObj.save()
                    .then(result => {
                        console.log(result)
                        const customerObj = new Customer()
                        customerObj.name = req.body.name
                        customerObj.email = req.body.email
                        customerObj.userId = result._id
                        customerObj.contact = req.body.contact
                        customerObj.save()
                            .then(customer => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "User Registered successfully",
                                    data: customer
                                })
                            })
                            .catch(err => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error",
                                    errors: err.message
                                })
                            })
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
            else {
                res.json({
                    status: 422,
                    success: false,
                    message: "Email already exist"
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

const getCustomer = async (req, res) => {

    const total = await Customer.find(req.body).countDocuments()
    Customer.find(res.body)
        .then(result => {
            res.json({
                status: 200,
                success: true,
                toral: total,
                data: result,
                message: "Data Loaded"
            })
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                errors: err.message,
                message: "Internal server error"
            })
        })

}

const updateCustomer = (req, res) => {
    validationError = [];
    if (!req.body.userId) {
        validationError.push("userId is required")
    }
   
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation error",
            errors: validationError
        })
    }
    else {
        Customer.findOne({ userId: req.body.userId })
            .then(result => {
                if (!!result) {
                    if (req.body.name)
                        result.name = req.body.name
                    if (req.body.email)
                        result.email = req.body.email
                     if (req.body.contact)
                        result.contact = req.body.contact
                    if (req.body.password)
                        result.password = req.body.password
                    result.save()
                    .then(update=>{
                        res.json({
                            status: 200,
                            success: true,
                            message: "Data Updated",
                            data: update
                        })
                    })
                    .catch(err=>{
                        res.json({
                            status: 500,
                            success: false,
                            message: "Internal server error",
                            errors: err.message
                        })
                    })
                }
                else{
                    res.json({
                        status: 422,
                        success: false,
                        message: "Record not found",
                        
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


const deleteCustomer = (req, res) => {
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
        Customer.findOne({ _id: req.body._id })
            .then(mydata => {
                if (!!mydata) {
                    mydata.deleteOne({ _id: req.body._id })
                        .then(updateData => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Record Deleted",
                                data: updateData
                            })
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
                    message: "Internal Server Error",
                    errors: err.message
                })
            })
    }
}

const singleCustomer = (req, res) => {
    validationError = [];
    if (!req.body.userId) {
        validationError.push("userId is required")
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
        Customer.findOne({ userId: req.body.userId })
            .then((data) => {
                if(!!data)
               {
                res.json({
                    status: 200,
                    success: true,
                    message: "Customer Loaded",
                    data: data

                })

               }
               else{
                res.json({
                    status: 422,
                    success: false,
                    message: "Record not found",
                   

                })
               }
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
module.exports = {
    addCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    singleCustomer
}