import express from "express";
import passport from "passport";
import { Signup, Signin, activationEmail, sendOtp, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

const CLIENT_URL = "http://localhost:3010/home";

router.post("/signup", Signup);
router.post("/activate", activationEmail);
router.post("/signin", Signin);

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

export default router;
