import express from "express";
import passport from "passport";

const router = express.Router();

const CLIENT_URL = "http://localhost:3010"

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

export default router;
