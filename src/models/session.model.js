const mongoose=require("mongoose");


const sessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User id is required"]
    },
    refreshToken:{
        type:String,
        required:[true,"Refresh token is required"]
    },
    ip:{ //ip address of the user
        type:String,
        required:[true,"IP address is required"]
    },
    userAgent:{  //browser,device etc
        type:String,
        required:[true,"User agent is required"]
    },
    revoked:{ //if session is revoked
        type:Boolean,
        default:false
    },
    createdAt:{ //when session was created
        type:Date,
        default:Date.now
    },
    expiresAt:{ //when session will expire
        type:Date,
        required:true
    }
})
const sessionModel=mongoose.model("sessions",sessionSchema)

module.exports=sessionModel;