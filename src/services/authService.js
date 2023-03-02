import Jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import Users from '../models/authModel';

async function forgotPassword({email}, origin) {
    const auth = await Users.findOne({where: {email}});

    if(!auth) return;

    
}
