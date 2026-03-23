const mongoose=require("mongoose")

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"]
    },
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"user is required"]
   },
   otpHashed:{
    type:String,
    required:[true,"OTP is Required"]
   },
   
},{
    timestamps:true
})
const otpModel=mongoose.model("otps",otpSchema);

module.exports=otpModel;