const jwt = require("jsonwebtoken")
require('dotenv').config();

function adminMiddleware(req,res,next){
  const token = req.headers.token;

  const decoded = jwt.verify(token , process.env.JWT_ADMIN_SECRET)

  if(decoded){
    req.userId = decoded.id;
    next()
  } else {
    res.status(403).json({
       mssg: "You are not signed in"
    })
  }
}

module.exports = {
 adminMiddleware : adminMiddleware
}