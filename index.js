const express = require("express");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "randomdas"

const app = express();



app.use(express.json())

app.post('/user/signup',function(req,res){
  
});

app.post('/user/signin',function(req,res){

});

app.get('/user/purchases',function(req,res){

});

app.post('/course/purchase',function(req,res){

});

app.get('/courses',function(req,res){

});


app.listen(3000);