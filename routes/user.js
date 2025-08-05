const {Router} = require("express");
const {z} = require("zod")
const bcrypt = require("bcrypt")
const userRouter = Router();
const jwt = require("jsonwebtoken")

const {userModel} = require("../db")

userRouter.post('/signup',async function(req,res){
   const requiredBody = z.object({
    email : z.email(),
    password :z.max(100).min(5).string() ,
    lastName :z.max(100).min(5).string() ,
    firstName : z.max(100).min(5).string() 
   })

   const parsedDataWithSuccess = requiredBody.safeParse(req.body);

   if(!parsedDataWithSuccess.success){
    res.json({
      mssg : "Incorrect format",
      error:parsedDataWithSuccess.error
    })
    return 
   }

  const {email,password, firstName , lastName} = req.body;
  const hashedPassword = await bcrypt.hash(password,2);

  await userModel.create({
    email : email,
    password : hashedPassword,
    lastName : lastName,
    firstName : firstName
  })
  res.json({
    mssg : "You are signed up"
  })  
});

userRouter.post('/signin',async function(req,res){
   
  const {email , password} = req.body;

  const response =  await userModel.findOne({
    email: email
  })

  if(!response){
    return res.status(401).json({
      mssg: "User not found"
    })
  }
  const passwordMatch = await bcrypt.compare(password,response.password);

  if(passwordMatch){
    const token = jwt.sign({
      id : response._id
    },process.env.JWT_SECRET)
    res.json({
      token : token
    })
  } else {
    res.status.json({
      mssg : "Wrong creds"
    })
  }


});

userRouter.get('/purchases',function(req,res){

});

module.exports ={
  userRouter : userRouter
}