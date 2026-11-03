// import path from "path";
// import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// console.log("🧠 ENV Loaded File:", path.resolve(process.cwd(), ".env"));
// console.log("🔑 PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID ? "YES" : "NO");

const express = require("express")
const db = require("./Database/db")

const app = express()
// const data = require("./data")
// const database = require(".")
var cors = require('cors')
app.use(cors())
// app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const routes = require("./Routes/ApiRoutes")
app.use("/api",routes)
const seeder = require("./utility/Seeder")
seeder.adminData()

app.listen(1000, ()=>{
console.log("Running port is 1000")
})