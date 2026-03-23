const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username already exists"]
        
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"]
        
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("User",userSchema)
