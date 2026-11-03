const user = require("../Api/Users/UserModel")
const bcrypt = require("bcrypt")
const saltRound = 10

const adminData = () => {

    user.findOne({ email: "har@gmail.com" })
        .then(userdata => {
            if (userdata == null) {
                
                const userObj = new user()
                userObj.name = "harpreet"
                userObj.email = "har@gmail.com"
                userObj.password = bcrypt.hashSync("admin@123",saltRound)
                userObj.userType = 1
                userObj.save()
                    .then(res => {
                        console.log("Admin Added")
                    })
            }
            else {
                console.log("Admin already exists")
            }
        })
        .catch(err => {
            console.log(err.message)
        })

}

module.exports = { adminData }