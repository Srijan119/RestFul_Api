const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/users-api",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{console.log("connection to databasse is done")}).catch((e)=>{
    console.log(e);
});