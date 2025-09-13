import { NextFunction , Response } from "express";
import jwt from "jsonwebtoken" ;  
import dotenv from "dotenv" ; 
import { AuthenticatedRequest } from "AuthenticatedRequest";
dotenv.config() ; 

export const AuthMiddleWare = ( req : AuthenticatedRequest , res : Response , next : NextFunction ) => {  
    try { 
        const authHeader = req.headers.authorization ; 
        if(!authHeader || !authHeader.startsWith("Bearer ")) { 
            res.status(401).json({ msg : "You are not authenticated."}) ; 
            return ;  
        }
        const token = authHeader.split(" ")[1] ; 
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY!) ; 
        if(typeof decoded === "object" && 
           decoded !== null && 
           "email" in decoded && 
           typeof decoded["email"] === "string" &&   
           "id" in decoded  && 
           typeof decoded["id"] === "number"
        ) { 
            const {email,id} = decoded as { email :string , id : number } ; 
            req.user = {email,id} ; 
            next() ; 
        }
        else { 
            res.status(401).json({"msg" : "Invalid token" }) ; 
            return ;  
        }
    }
    catch(e:any) { 
        if(e.name==="TokenExpiredError") { 
            res.status(401).json({msg:"Token expired"}) ; 
            return ; 
        } 
        if(e.name==="JsonWebTokenError") { 
            res.status(401).json({msg:"Invalid token"}) ; 
            return ;
        } 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."})        
    }
}