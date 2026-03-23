const { Router } = require("express");
const authController = require("../controllers/auth.controllers");

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);
//identifying user from rteuest get me

authRouter.get("/get-me",authController.getMe);
console.log("GET /get-me route registered!");

authRouter.get("/refresh-token",authController.refreshToken); // to refresh access token

authRouter.get("/logout",authController.logout);
authRouter.get("/logoutAll",authController.logoutAll);

authRouter.post("/verify-email", authController.verifyEmail);

 

module.exports = authRouter;