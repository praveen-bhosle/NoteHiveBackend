import { NextFunction, Response } from "express";
import { prisma } from "../prisma";
import { getUserRole } from "../services/WorkspacesOnUsersService";
import { AuthorizedRequest } from "AuthorizedRequest";

export const RoleMiddleware = async  (req:AuthorizedRequest , res : Response , next : NextFunction ) => { 
    try { 
        const {id} = req.user ; 
        const workspaceId = req.query.workspaceId ;   
        if(!workspaceId) { 
            res.status(400).json({msg:"Invalid or missing fields in request body"}) ; 
            return ; 
        }
        const parsedWorkspacedId = parseInt(workspaceId.toString()) ;  
        if(isNaN(parsedWorkspacedId)) { 
            res.status(400).json({msg:"Invalid or missing fields in request body"}) ; 
            return ; 
        }
        const role = await getUserRole({prisma,workspaceId : parsedWorkspacedId,userId:id}) ;  // this will do all the checks , whether user belongs to the workspace and if he has admin role. 
        if(!role)  {
            res.status(403).json({"msg" : "You are not authorized for this action."}) 
            return ;
        }
        req.user = { ...req.user , role   } ; 
        req.context = { workspaceId : parsedWorkspacedId } ;  
        next() ;
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
}