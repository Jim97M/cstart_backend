import dotenv from "dotenv";
import cookieSession from "cookie-session";
import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import url from "url";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";

import passportRouter from "./src/routes/authRouter.js";
import roleRouter from "./src/routes/roleRouter.js";
import tutorialRoute from "./src/routes/tutorialRoute.js";

const app = express();

const PORT = 5000;

dotenv.config();

let corsOptions = {
  localhost: "http://localhost:5000",
};

app.use(express.json());
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

global.__basedir = __dirname;

app.use(
  cookieSession({
    name: "session",
    keys: ["cstart"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//    {
//      clientID: FACEBOOK_APP_ID,
//      clientSecret: FACEBOOK_APP_SECRET,
//      callbackURL: "/auth/facebook/callback"
//    },
//    function(accessToken, refreshToken, profile, done){
//      done(null, profile)
//    }
//   )
// )

// passport.use(
//     new GithubStrategy(
//         {
//             clientID: GITHUB_CLIENT_ID,
//             clientSecret: GITHUB_CLIENT_SECRET,
//             callbackURL: "/auth/facebook/callback"
//         },
//         function(accessToken, refreshToken, profile, done){
//             done(null, profile)
//           }
//     )
// )

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/media", express.static("media"));
app.use("/api/v1/auth", passportRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/tutorial", tutorialRoute);

app.listen(PORT, "192.168.1.120", () => {
  console.log("Server Started Successfully" + PORT);
});
