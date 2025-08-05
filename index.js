const express = require("express");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "randomdas"

const {courseRouter} = require('./routes/course')
const {userRouter} = require('./routes/user')
const {adminRouter} = require('./routes/admin')

const app = express();

app.use(express.json())

app.use("/api/v1user",userRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/admin",adminRouter)

app.listen(3000);