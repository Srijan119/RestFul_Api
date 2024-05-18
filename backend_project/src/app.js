require("dotenv").config();
const express = require("express");
const app = new express();
require("./db/connection")
const hbs = require("hbs");
const pathName = require("path");
const auth = require("../src/middleware/auth");
const register = require("./models/registration");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");



app.use(cookieParser());
app.use(express.static(pathName.join(__dirname , '../public')));


const path_ = pathName.join(__dirname,"/templates/views");
const partial_path = pathName.join(__dirname,"/templates/partials")
console.log(path_);

app.set("view engine","hbs");
app.set("views",path_);
app.use(express.urlencoded({extended:false}))
hbs.registerPartials(partial_path);

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/secret",auth,(req,res)=>{
    try{
        res.render("secret")}
        catch(e){
            res.send(e);
        }
})


app.get("/logout",auth, async (req,res)=>{
    try{
// logout logged in single session
req.user.tokens= req.user.tokens.filter((elem)=>{
    return elem.token !== req.token ;  
})
//logout all devices
// req.user.tokens=[];
res.clearCookie("jwt");      
await req.user.save();
res.render("login");




        }

        catch(e){
res.send(e);
        }
})



app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
try{
const email = req.body.email;

const userEmail = await register.findOne({email:email});
const isMatch = await bcrypt.compare(req.body.password,userEmail.password)
const token = await userEmail.JwtToken();
res.cookie("jwt",token,{expires:new Date(Date.now()+600000),httpOnly:true
});
console.log(token);
if(!userEmail){
    res.send("invalid email or password")         
}
if(userEmail){
    if(!isMatch){
        res.send("invalid  password")
    }
    else{
        res.status(201).render("home")
    }
}

}
catch (e){
    console.log(e);
    res.status(400).send("invalid email");

}
})


app.post("/register",async(req,res)=>{
    try{


if(req.body.password === req.body.confirmPassword){
const registeredUser = new register({

    name :  req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    Address:req.body.Address,
    password:req.body.password,
    confirmPassword:req.body.confirmPassword
})



const token = await registeredUser.JwtToken();
console.log(token);
res.cookie("jwt",token,{expires:new Date(Date.now()+30000),httpOnly:true});
console.log(res.cookie);
const userRegistered = await registeredUser.save();
res.status(200).render("home");
}
else{
    res.send("password mismatch");

}

    }
    catch(e){
res.status(400).send(e);
    }
})


app.listen("8000",()=>{
    console.log("connection successfully at port")
})
































//jsonwebtoken example 

// const jwt = require("jsonwebtoken");

// const createToken = async()=>{
// const token =await jwt.sign({id:'2482748242'},"mynameissrijan",{expiresIn:'2 seconds'});
// console.log(token);
// const verifyToken = await jwt.verify(token,"mynameissrijan");
// console.log(verifyToken)

// }

// createToken();