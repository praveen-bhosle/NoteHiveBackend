import { Router,Request,Response } from "express";
import bcrypt from "bcrypt"; 
import { prisma } from "../prisma";
import { checkUserExists, createUser , getUser } from "../services/UserService";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv' ; 
dotenv.config() ; 
const AuthRouter = Router() ; 

AuthRouter.post("/signup",async (req: Request , res :Response) => { 
    try { 
        const {name,email,password} = req.body ; 
        const salt  = await bcrypt.genSalt(10) ; 
        const hashedPassword = await bcrypt.hash(password,salt) ; 
        await prisma.$connect() ; 
        const userExists = await  checkUserExists({prisma,email}) ; 
        if(userExists) {
            res.status(409).json({msg:"user alredy exists"}) ;  
            return ;   
        }
        await createUser({prisma,name,email,password}) ;  
        res.status(200).json({msg :"Account created"}) ; 
        return ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
    finally { 
        await prisma.$disconnect() ; 
    }
}) 

AuthRouter.post("/login" , async  (req : Request , res : Response ) => { 
    try { 
        const {email,password} = req.body ;  
        await prisma.$connect() ; 
        const  user  = await getUser({prisma,email}) ; 
        if(!user) { 
            res.status(401).json({msg:"invalid credentials"}) ; 
            return ; 
        }
        const verifyPassword = await bcrypt.compare(password,user.password) ; 
        if(!verifyPassword) { 
            res.status(401).json({msg:"invalid credentials"}) ; 
            return ; 
        }
        console.log(process.env.JWT_SECRET_KEY) ;
        const token  = jwt.sign({ email , id : user.id} , process.env.JWT_SECRET_KEY! , { expiresIn : '7d' } ) ;   
        res.status(200).json({msg:"Logged in successfully." , token});   
        return ;   
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
    finally { 
        await prisma.$disconnect() ; 
    }   
}) ; 

export { AuthRouter }  ; 