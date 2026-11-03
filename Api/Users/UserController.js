const user = require('../Users/UserModel')
const bcrypt = require('bcrypt')
const saltRound = 10;
const jwt = require('jsonwebtoken');
const userModel = require('../Users/UserModel');
const myKey = "MyFirstStack@091994"
const login = (req, res) => {
    validationError = [];
    if (!req.body.email) {
        validationError.push("email is required")
    }
    if (!req.body.password) {
        validationError.push("password is required")
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
            .then(result => {
                if (!result) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Email doesnt Exist",

                    })
                }
                else {
                    bcrypt.compare(req.body.password, result.password, function (err, data) {
                        if (data) {
                            var payload = {
                                _id: result._id,
                                name: result.name,
                                email: result.email,
                                status: result.status,
                                userType: result.userType,
                               
                            }
                            var token = jwt.sign(payload, myKey)

                            res.json({
                                status: 200,
                                success: true,
                                message: "Login Succesfully",
                                data: result,
                                token: token
                            })
                        }
                        else {
                            res.json({
                                status: 404,
                                success: false,
                                message: "Invalid Password",

                            })
                        }
                    })

                }


            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server Error",
                    errors: err.message
                })
            })
    }
}

const changePassword = (req, res) => {
    validationError = [];
    if (!req.body.oldPassword) {
        validationError.push("old password is required")
    }
    if (!req.body.newPassword) {
        validationError.push("new password is required")
    }
    if (!req.body.confirmPassword) {
        validationError.push("confirm password is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation errors",
            errors: validationError
        })
    }
    else {
        userModel.findOne({ _id: req.body._id })
            .then(userData => {
                if (userData == null) {
                    res.json({
                        status: 422,
                        success: false,
                        message: "User not found"
                    })
                }
                else {
                    bcrypt.compare(req.body.oldPassword, userData.password, (err, result) => {
                        if (!result) {
                            res.json({
                                status: 422,
                                success: false,
                                message: "Old password not match",
                            })
                        }
                         else{
                            if (req.body.newPassword == req.body.confirmPassword) {
                                

                                userData.password = bcrypt.hashSync(req.body.newPassword, saltRound)
                                userData.save()

                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "Password update successfully"
                                })
                            }
                            else {
                                res.json({
                                    status: 422,
                                    success: false,
                                    message: "New password and confirm password not matched"
                                })
                            }
                         }
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: 500,
                    success: true,
                    message: "Internal server error",
                    errors: err.message
                })
            })
    }

}






module.exports = { login ,changePassword}