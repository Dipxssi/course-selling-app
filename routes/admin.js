const {Router} = require("express");
const {z} = require("zod")
const bcrypt = require("bcrypt")
const adminRouter = Router();
const jwt = require("jsonwebtoken")
const {adminModel} = require("../db")

adminRouter.post('/signup', async function(req,res){
  
  const requiredBody = z.object({
     email : z.email(),
     password : z.max(10).min(5).String(),
     firstName : z.max(10).min(5).String(),
     lastName : z.max(10).min(5).String(),
  })

   const parsedDataWithSuccess = requiredBody.safeParse(req.body);

   if(!parsedDataWithSuccess.success){
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
  
   const hashedPassword = await bcrypt.hash(password,2);

   await adminModel.create({
    email : email,
    password : hashedPassword,
    firstName : firstName,
    lastName : lastName
   })
  res.json({
    mssg: "Signed up"
  })
});

adminRouter.post('/signin',async function(req,res){
   const {email , password} = req.body;

   const response = await adminModel.findOne({
      email : email
   })

   if(!response){
    res.status(403).json({
      mssg: "User dosen't exists in db"
    })
    return 
   }
   const passwordMatch = await bcrypt.compare(password,response.password)

   if(passwordMatch){
     const token = jwt.sign({
          id : response._id
     },process.env.JWT_ADMIN_SECRET)
     res.json({
      token : token
     })
   } else{
    res.status(403).json({
      mssg : "Incorrect credentials"
    })
   }
});

adminRouter.post('/course',function(req,res){

});

adminRouter.put('/course',function(req,res){

});

adminRouter.get('/course/bulk',function(req,res){

});

module.exports ={
  adminRouter : adminRouter
}