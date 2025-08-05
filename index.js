const express = require("express");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const {courseRouter} = require('./routes/course')
const {userRouter} = require('./routes/user')
const {adminRouter} = require('./routes/admin')
require('dotenv').config();

const app = express();

app.use(express.json())

app.use("/api/v1user",userRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/admin",adminRouter)

async function main(){
await mongoose.connect(process.env.MONGO_URI)
}

main();
app.listen(3000);