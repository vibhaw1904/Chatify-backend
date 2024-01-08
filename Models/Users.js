const mongoose=require('mongoose')
const validator=require('validator')

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,'please add username'],
        trim:true,
        minlength:4,
    }
    ,
    email:{
        type:String,
        required:[true,'please add your email'],
        unique:true,
        trim:true,
        validate:{
            validator:validator.isEmail,
            message:'please provide the email'
        }
    },
    password:{
        type:String,
        required:[true,'add your password'],
        minlength:8,
        trim:true
    },
    bio: {
        type: String,
        default: "Hello There!",
        minlength: 2,
        maxlength: 250,
      },
})
const User = mongoose.model("User", userSchema);
module.exports = User;