const { Router } = require("express");
const { z } = require("zod")
const bcrypt = require("bcrypt")
const adminRouter = Router();
const jwt = require("jsonwebtoken")
const { adminModel, courseModel } = require("../db")
require('dotenv').config();
const { adminMiddleware } = require("../middleware/admin")

adminRouter.post('/signup', async function (req, res) {

  const requiredBody = z.object({
    email: z.email(),
    password: z.max(10).min(5).String(),
    firstName: z.max(10).min(5).String(),
    lastName: z.max(10).min(5).String(),
  })

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      mssg: "Incorrect format",
      error: parsedDataWithSuccess.error
    })
    return
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const hashedPassword = await bcrypt.hash(password, 2);

  await adminModel.create({
    email: email,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName
  })
  res.json({
    mssg: "Signed up"
  })
});

adminRouter.post('/signin', async function (req, res) {
  const { email, password } = req.body;

  const response = await adminModel.findOne({
    email: email
  })

  if (!response) {
    res.status(403).json({
      mssg: "User dosen't exists in db"
    })
    return
  }
  const passwordMatch = await bcrypt.compare(password, response.password)

  if (passwordMatch) {
    const token = jwt.sign({
      id: response._id
    }, process.env.JWT_ADMIN_SECRET)
    res.json({
      token: token
    })
  } else {
    res.status(403).json({
      mssg: "Incorrect credentials"
    })
  }
});

adminRouter.post('/course', adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  await courseModel.create({
    title, description, imageUrl, price, creatorId: adminId
  })

  res.json({
    mssg: "Course created",
    courseId: course._id
  })

});

adminRouter.put('/course', adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne({
    _id: courseId,
    creatorId: adminId
  }, {
    title, description, imageUrl, price
  })

  res.json({
    mssg: "Course updated",
    courseId: course._id
  })
});

adminRouter.get('/course/bulk',adminMiddleware,async function (req, res) {
   const adminId = req.userId
   const courses = await courseModel.find({
    creatorId: adminId
  })

  res.json({
    mssg: "Course updated",
    courses
  })
});

module.exports = {
  adminRouter: adminRouter
}