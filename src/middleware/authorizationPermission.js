import * as Helper from "../helpers/helper.js";

export const Authenticated = (req, res, next) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];
        if(token === null){
            return res.status(401).send({ msg: "Unauthorized" });
        }
        const result = Helper.ExtractToken(token);
        console.log("Authenticated result is", result);
        if(!result) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.log("Error is", error);
    }
}


export const StudentRole = (req, res, next) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];

        const result = Helper.ExtractToken(token);

        const roleId = result.roleId;

        if (roleId !== 3) {
            return res.status(403).send({ msg: "Forbidden" });
        } 
        next();
    } catch (error) {
        return res.status(500).send(error);
    }
 }
 
 export const FacultyRole = (req, res, next) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];

        const result = Helper.ExtractToken(token);

        const roleId = result.roleId;

        if (roleId !== 2) {
            return res.status(403).send({ msg: "Forbidden" });
        } 
        next();
    } catch (error) {
        return res.status(500).send(error);
    }
 }

 export const AdminRole = (req, res, next) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];

        const result = Helper.ExtractToken(token);

        const roleId = result.roleId;

        if (roleId !== 1) {
            return res.status(403).send({ msg: "Forbidden" });
        } 
        next();
    } catch (error) {
        return res.status(500).send(error);
    }
 }

