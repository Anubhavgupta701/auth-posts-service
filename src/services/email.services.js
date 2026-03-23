const nodemailer=require("nodemailer")
const config=require("../config/config")

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:config.GOOGLE_USER,
        clientId:config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        refreshToken:config.GOOGLE_REFRESH_TOKEN      
    }
})

//verify the connection configuration
transporter.verify(function(error,success){
    if(error){
        console.log(error)
    }else{
        console.log("Server is ready to take our messages")
    }
})

//send email
const sendEmail=async(to,subject,text,html)=>{
    try {
         const info=await transporter.sendMail({
            from:'"Your Name" <${config.GOOGLE_USER}>',
            to,
            subject,
            text,
            html
         })
         console.log("Message sent: %s", info.messageId);
         console.log("preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error in sendEmail:", error)
    }
}

module.exports={sendEmail}