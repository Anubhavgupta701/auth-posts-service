const mongoose=require("mongoose");

 
const postSchema=new mongoose.Schema({
    image:{
        type:String,
        required:[true,"Image is required"]
    },
    caption:{
        type:String,
        default:""
    }
},{ collection: "posts" })
const postModel=mongoose.model("posts",postSchema);
module.exports=postModel;