import dotenv from 'dotenv';

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import {google} from 'googleapis';
import sendEmail from '../utils/sendEmail.js';
import Users from "../models/authModel.js";
import TokenModel from '../models/tokenModel.js';
import Config from "../config/authConfig.js";

dotenv.config();

const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.GOOGLE_CLIENT_ID)

const {CLIENT_URL} = process.env

export const Signup = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    //   const user = await Users.findOne({ email });
    //   if(!user) {
    //       return res.status(401).json({
    //           message: "Invalid email or password",
    //       });
    //   }

    //   const validPassword = await bcryptjs.compare(password, user.password);
    //   if (!validPassword) {
    //       return res.status(401).json({
    //           message: "Invalid email or password", 
    //     })
    //   }

      const newUser = { email, password };
     
      const activation_token = createActivationToken(newUser);
      const url = `${CLIENT_URL}/api/v1/auth/activate/${activation_token}`
      sendEmail(email, url, "Verify Your EmaiACTIVATION_TOKEN_SECRETl Address")

  } catch (err) {
     res.status(500).send({message: err.message});
  }
}

export const Signin = (req, res) => {
    try {
        Users.findOne({
            where: {email: req.body.email}
        }).then(user => {
            if(!user){
                return res.status(404).send({message: "User not Found."});
            }

            let validPassword = bcryptjs.compareSync(
                req.body.password,
                user.password
            );

            if(!validPassword) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password"
                });
            }

            let token = jsonwebtoken.sign({id: user.id}, Config.secret, {
                expiresIn: 86400,
            });
            res.status(200).send({
                id: user.id,
                email: user.email,
                password: user.password,
                accessToken: token
            })
        }) 
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const activationEmail = async (req, res) => {
    try {
       const {activation_token} = req.body;
       const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
       const {email, password} = user;
       const findUser = await Users.findOne({email});

       if(findUser) return res.status(400).json({msg: "This email already exists"});

       const newUser = new Users({
         email, password
       });

       await newUser.save();
       res.json({msg: "Account has been activated"});
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  }

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}
