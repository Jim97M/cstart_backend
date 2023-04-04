import express from "express";
import passport from "passport";
import { Signup, Signin, activationEmail, sendOtp, verifyOtp, sendPasswordResetEmail, forgotPassword, resetPassword, validUser, getAllUsers, getSingleUser } from "../controllers/authController.js";

const router = express.Router();

const CLIENT_URL = "http://localhost:3010/home";

router.post("/signup", Signup);
router.post("/activate/:confirmationCode", activationEmail);
router.post("/signin", Signin);

router.get('/allusers', getAllUsers);
router.get('/user/:id', getSingleUser);
router.get("/google", passport.authenticate("google", {scope:["profile"]}));

router.get(
   "/google/callback",
   passport.authenticate("google", {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
   })
);

router.get("/github", passport.authenticate("github", {scope: ["profile"]}));

router.get("/github/callback", passport.authenticate("github", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
})
);

router.get("/facebook", passport.authenticate("facebook", {scope: ["profile"]}));

router.get("/facebook/callback", passport.authenticate("facebook", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
})
);

router.get("/send/:to", sendOtp);
router.get("/verify/:to/:code", verifyOtp);

router.post("/sendpasswordlink", sendPasswordResetEmail);

router.post("/id:/:token", resetPassword);

router.post("/forgotpassword/:id/:token", forgotPassword);
router.get("/validuser", validUser);

export default router;
