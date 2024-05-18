const register = require("../models/registration");
const jwt = require("jsonwebtoken");


const auth = async (req,res,next) =>{

try{

const token = req.cookies.jwt;
const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
const user = await register.findOne({_id:verifyToken.id});
req.user = user;
req.token =  token;
next();



}
catch(e){
res.status(401).send(e);

}



}

module.exports = auth;