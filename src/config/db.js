const mongoose = require("mongoose");
const config = require("./config");

 async function connectdb(){
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log("Database connected")
  } catch (error) {
    console.log(error)
  }
 }

 module.exports = connectdb;