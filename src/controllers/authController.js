import dotenv from 'dotenv';
import { Op } from 'sequelize';
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import {google} from 'googleapis';
import twilio from 'twilio'; 
import multer from "multer";
import path from "path";
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

export const Signup = async (req, res) => {
    const token = jsonwebtoken.sign({email: req.body.email}, Config.secret);
  try {
    const roleId = req.body.roleId;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const fullname = req.body.fullname; 
    const confirmationCode = token;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    
    let user = await Users.findOne({where: {email : email}});

   
   if(user){
       return res.status(403).send({message: "User Already Exists"});
    }     if(password !== confirm_password) {
        return res.status(400).send({
         message: 'Please provide all fields'
     })
     }
    
    else if(!email || !password || !fullname) {
       console.log("Please Provide All Fields")
    } else {
       Users.create({
        roleId: roleId,
        email: email,
        phone_number: phone_number,
        fullname: fullname,
        confirmationCode,
        password: bcryptjs.hashSync(password, 8)
       })
    }
    const url = `http://localhost:5000/api/v1/auth/activate/:${confirmationCode}`
     sendEmail(email, url, "Verify Your Email Address")
    return res.status(201).send({message: "User Registered successfully"});
  } catch (err) {
   return  res.status(500).send({message: err.message});
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

export const getSingleUser = async (req, res, next) => {
   const a_id = req.params.id;
   Users.findByPk(a_id).then(user => {
    if(!user){
        res.status(404).json({message: "User Not Found"});
        next();
    } else {
        res.json(user)
    }
   }).catch()
}


export const getAllUsers = async (req, res) => {
   await Users.findAll().then(data => {
      res.status(200).send(data);
   });
};

export const activationEmail = async (req, res) => {
        Users.findOne({
            confirmationCode: req.params.confirmationCode
        })
        .then((user) => {
            console.log(user);
            if(!user) {
                return res.status(404).send({message: "User Not Found"});
            }
           user.status = "Active";
           user.save((err) => {
            if(err){
                res.status(500).send({message: err});
            }
           }); 
        })
        .catch((e) => console.log("error", e));
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
      cb(null, __basedir + '/media');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    } 
  });

 export const upload = multer({
    storage: storage,
    limits: {fileSize: '1000000'},
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg||jpg||png||gif/
        const mimeTypes = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeTypes && extname){
          return cb(null, true)
        }
        cb('Please upload proper file type');
    }
}).single('image');
