import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const GenerateToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1d' });

    return token;

}

export const GenerateRefreshToken = (data) => {
   
    const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN, { expiresIn: '1d' });

    return token;
}

export const ExtractToken = (token) => {
    const secretKey = process.env.JWT_ACCESS_TOKEN;
    let resData;
    const res = jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            resData = null;
        } else {
            resData = decoded;
        }

        if(resData){
            const result = resData;
            return result;
        }

        return null;
    });
}

export const ExtractRefreshToken = (token) => {
    const secretKey = process.env.JWT_REFRESH_TOKEN;
    let resData;
    const res = jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            resData = null;
        } else {
            resData = decoded;
        }

        if (resData) {
            const result = resData;
            return result;
        }

        return null;
    }
    );
}
