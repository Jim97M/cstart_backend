import dotenv from 'dotenv';

import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import {google} from 'googleapis';
import twilio from 'twilio'; 
import sendEmail from '../utils/sendEmail.js';
import Users from "../models/authModel.js";
import Config from "../config/authConfig.js";

dotenv.config();

const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.GOOGLE_CLIENT_ID)

const {CLIENT_URL} = process.env;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

export const Signup = (req, res) => {
  try {
    const roleId = req.body.roleId;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const fullname = req.body.fullname; 
    const image_name = "http://192.168.0.37:5000/media/"+ req.file.filename;
    const image_type = req.file.mimetype;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    

    const user = Users.findOne({where : {email: email}});

    if(user){
        res.status(403).send({message: "User Already Exists"});
    } else if(password !== confirm_password) {
        console.log("Passwords Do not Match")
    } else if(!email || !password || !fullname) {
       console.log("Please Provide All Fields")
    } else {
       Users.create({
        roleId: roleId,
        email: email,
        phone_number: phone_number,
        fullname: fullname,
        image_name: image_name,
        image_type: image_type,
        password: bcryptjs.hashSync(password, 8)
       })
    }
    //   const activation_token = createActivationToken(newUser);
    //   const url = `http://localhost:5000/api/v1/auth/activate/${activation_token}`
    //   sendEmail(email, url, "Verify Your EmaiACTIVATION_TOKEN_SECRETl Address")
     res.status(201).send({message: "User Registered successfully"});
  } catch (err) {
     res.status(500).send({message: err.message});
  }
}

export const Signin = (req, res) => {
    const {email} = req.body;
    try {
        Users.findOne({
            where: {email: email}
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
                roleId: user.roleId,
                password: user.password,
                accessToken: token
            })
        }) 
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const sendPasswordResetEmail = async (req, res, next ) => {
    const {email} = req.body;

    if(!email){
        res.status(401).json({status:401,message:"Enter Your Email"})
    }

    try {    
        Users.findOne({
        where: {email: email}
    }).then(user  => {
        if(!user){
            return res.status(404).send({message: "User not Found."});
        }

    

        let token = jsonwebtoken.sign({id: user.id}, Config.secret, {
            expiresIn: "180s",
        });

        const setUserToken =  Users.update({id: user.id}, {verificationToken: token}, {new: true});
      
        if(setUserToken){

           const url = `http://localhost:5000/api/v1/auth/forgotpassword/${user.id}/${setUserToken.verificationToken}`
           sendEmail(email, url, "Your Password Reset Link")

        }
    }) 
    } catch (error) {
        res.status(401).json({status:401, error})
    }

}

export const forgotPassword = async (req, res) => {

    const {id, token} = req.params;

    try {
        Users.findOne({where: {email:email, verificationToken: token}}).then(user => {
            const verifyToken = jsonwebtoken.verify(token, Config.secret);
            console.log(verifyToken);

            if(user && verifyToken.id) {
             
            res.status(201).json({status:201,validuser}) 
            } else {
                res.status(401).json({status:401,message:"user not exist"})
            }
        })
    } catch (error) {
        
        res.status(401).json({status:401,error})
    }
}

// change password

export const resetPassword = async(req,res)=>{
    const {id,token} = req.params;

    const {password} = req.body;

    try {
        Users.findOne({where: {email:email, verificationToken: token}}).then(user => {
            const verifyToken = jsonwebtoken.verify(token, Config.secret);
            console.log(verifyToken);

            if(user && verifyToken.id) {
                const newpassword = bcryptjs.hash(password, 12);

                const setnewuserpass = Users.update({id: id}, {password: newpassword});
               
                setnewuserpass.save();


                res.status(201).json({status:201,setnewuserpass})

            } else{
                res.status(401).json({status:401,message:"user not exist"})
            }
        })
    } catch (error) {
        res.status(401).json({status:401,error})
    }
}

export const validUser = (req, res) => {
  try {
    Users.findOne({
        where: {email: req.body.email}
    }).then(user => {
        if(!user){
            return res.status(404).send({message: "User not Found."});
        } else
        res.status(200).send({
            id: user.id,
            email: user.email,
            roleId: user.roleId,
        })
    }) 
  } catch (error) {
    
  }
}

export const activationEmail = async (req, res) => {
    try {
       const {activation_token} = req.body;
       const user = jsonwebtoken.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
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
    return jsonwebtoken.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '10m'})
}

export const sendOtp = (req, res) => {
  const to = req.params.to;
    twilioClient.verify.services(TWILIO_SERVICE_SID)
    .verifications.create({to, channel: 'sms'})
        .then(verification => {
            res.json(verification)
})
        .catch(err => {
            res.json(err);   
        })
}

export const verifyOtp = async (req, res) => {
    const to = req.params.to;
    const code = req.params.code;
    twilioClient.verify.services(TWILIO_SERVICE_SID)
        .verificationChecks.create({ to, code })
        .then(res => {
        res.status(200).send({msg: "Phone Verified Successfully"});
        })
        .catch(err => {
            res.json(err);
        })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/media')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
 })

export const upload = multer({
    storage: storage,
    limits: {fileSize: '100000'},
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

            if(mimeType && extname) {
                return cb(null, true)
            }
            cb('Give proper files formate to upload')
        }
}).single('video');

