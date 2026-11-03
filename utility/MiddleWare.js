const jwt = require('jsonwebtoken')
const myKey = "MyFirstStack@091994"

module.exports = (req,res,next) =>{
    let token = req.headers["authorization"]
    console.log(token)
    jwt.verify(token, myKey, function (err, data){
        if(err != null){
            res.json({
                status : 403,
                success:false,
                message : "Unauthenticated user"
            })
        }
        else{
            req.decoded = data 
            next()
        }
    })
}