import { Response, Router } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { prisma } from "../prisma";

import { getUserData } from "../services/UserService";

const UserRouter = Router() ;  

UserRouter.get('/userData' ,  async ( req : AuthenticatedRequest , res :Response  ) => { 
    const {id } = req.user ; 
    const user = await getUserData({prisma , id  }) ; 
    res.status(200).json( { msg : "" , data :  user}) ; 
    return user ; 
}) ; 

export {UserRouter} ; 