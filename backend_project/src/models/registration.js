const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const registrationSchema =  new mongoose.Schema({
 name:{
    type:String,
    unique:true,
    required : true
 },
 email:{
    type:String,
    unique: [true, "Email id already present"],
required:true,
    validate(val){
        if(!validator.isEmail(val)) {throw new Error("invalid email entered")}
    }
 },

 phone:{
type:Number,
unique:true,
required:true

 },

 Address:{
    type:String,
    required:true,

 },

 password:{
    type:String,
    required:true
 },

 confirmPassword:{
    type:String,
    required:true
 },
 tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
 ]



})



//save jwt token middleware

registrationSchema.methods.JwtToken =  async function () {
try{
const token = jwt.sign({id:this._id.toString()},process.env.SECRET_KEY);
this.tokens = this.tokens.concat({token:token})
await this.save();
return token;
}
catch(e){
    console.log("error while creating token");
}
}








//hash-password middleware

registrationSchema.pre("save", async function(next){
if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    this.confirmPassword =  await bcrypt.hash(this.password,10);
    
}
next();

})


const register = new mongoose.model('Register',registrationSchema);


module.exports = register;