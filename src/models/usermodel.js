const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchemma = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    }, 
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    avatar:{
        type:String,
        
        
    },
    password:{
        type:String,
        required:true,
        
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    


},{timestamps:true})


userSchemma.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });


userSchemma.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  };


  userSchemma.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

    



const Usermodel = mongoose.model("Usermodel" ,userSchemma)

module.exports= Usermodel