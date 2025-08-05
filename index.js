const express = require("express");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "randomdas"

const {courseRouter} = require('./routes/course')
const {userRouter} = require('./routes/user')

const app = express();

app.use(express.json())

app.use("/user",userRouter)
app.use("/course",courseRouter)

app.listen(3000);