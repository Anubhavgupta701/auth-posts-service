const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const sessionModel = require("../models/session.model");
const crypto = require("crypto");
const { sendEmail } = require("../services/email.services")
const { generateOtp, getOtpHtml } = require("../utils/utils")
const otpModel = require("../models/otp.model")


async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const isAlreadyRegistered = await User.findOne({
            $or: [{ username }, { email: normalizedEmail }]
        });

        if (isAlreadyRegistered) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: normalizedEmail,
            password: hashedPassword
        });


        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHashed = crypto.createHash("sha256").update(otp.toString()).digest("hex");
        await otpModel.create({
            email: normalizedEmail,
            user: user._id,
            otpHashed,

        });
        await sendEmail(normalizedEmail, "Verify your email", `Your OTP is ${otp}`, html);





        res.status(201).json({
            message: "User registered successfully, please verify your email.",
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
                verified: user.verified,
            }
        });

    } catch (error) {
        console.error("Register Error Stack:", error.stack);
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!user.verified) {
            return res.status(401).json({ message: "User not verified" })
        }
        // Compare the raw password with the bcrypt hash stored in the DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const refreshToken = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: "30d"
        });
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.create({
            userId: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip || "unknown",
            userAgent: req.headers["user-agent"] || "unknown",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        const accessToken = jwt.sign({
            id: user._id,
            sessionId: session._id
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            },
            accessToken
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMe(req, res) { //identifying user from request
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        };

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id)

        res.status(200).json({
            message: "User found",
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user })

    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex"); // Hash token deterministically
        const session = await sessionModel.findOne({
            refreshToken: refreshTokenHash,
            revoked: false
        });
        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }

        const accessToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        })

        // Generate new refresh token using decoded.id (since user is not queried here)
        const newRefreshToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET, {
            expiresIn: "30d"
        });

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        session.refreshToken = newRefreshTokenHash;
        await session.save();

        // Always set cookies BEFORE sending the JSON response
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Finally, send the response
        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        })

    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.findOne({
            refreshToken: refreshTokenHash,
            revoked: false
        });
  
        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }
        session.revoked = true;
        await session.save();
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function logoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        await sessionModel.updateMany({
            userId: decoded.id,
            revoked: false
        }, {
            $set: { revoked: true }
        });
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || otp === undefined || otp === null || otp === "") {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedOtp = String(otp).trim();

        const otpHash = crypto.createHash("sha256").update(normalizedOtp).digest("hex");

        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const otpDoc = await otpModel.findOne({
            email: { $regex: new RegExp(`^${escapedEmail}$`, "i") },
            otpHashed: otpHash
        })
        if (!otpDoc) {
            return res.status(400).json({
                message: "invalid otp"
            })
        }



        const user = await User.findByIdAndUpdate(otpDoc.user, {
            verified: true
        });

        await otpModel.deleteMany({
            user: otpDoc.user,
        });
        return res.status(200).json({
            message: "Email verified successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified

            }
        })
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

 
module.exports = { register, getMe, refreshToken, logout, logoutAll, login, verifyEmail };