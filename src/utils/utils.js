function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000) //otp html format m aata h
}
function getOtpHtml(otp){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .otp-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 8px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .note {
            color: #999;
            font-size: 12px;
            margin-bottom: 20px;
        }
        .footer {
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🔐</div>
        <div class="title">Verify Your Email</div>
        <div class="subtitle">Please enter the following OTP to verify your email address</div>
        
        <div class="otp-box">
            <div class="otp-code">${otp}</div>
        </div>
        
        <div class="note">This code will expire in 10 minutes</div>
        
        <div class="footer">
            If you did not request this code, please ignore this email.
        </div>
    </div>
</body>
</html>
    `
}

module.exports={generateOtp,getOtpHtml}
