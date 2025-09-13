import { Response, Router } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { prisma } from "../prisma";
import { checkWorkspaceExists, createWorkspace, deleteWorkspace, updateWorkspace } from "../services/WorkspaceService";
import { removeUser, upsertUser } from "../services/WorkspacesOnUsersService";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthorizedRequest } from "AuthorizedRequest";

const WorkspaceRouter = Router() ;  

WorkspaceRouter.post("" , async  (req : AuthenticatedRequest  , res : Response )  => {  
    const { id  } =  req.user ;  
    const { workspaceName }  = req.body  ; 
    if(!workspaceName) { 
        res.status(404).json({msg:"The field workspaceName is not present in the request body."}) ; 
        return ; 
    }
    await prisma.$connect() ;
    const workspaceExists = await checkWorkspaceExists({prisma,name:workspaceName, userId : id }) ;  
    if(workspaceExists) { 
        res.json(409).json({msg:"The workspace name is alredy taken"}) ; 
        return ; 
    }
    const workspace = await createWorkspace({prisma,name:workspaceName,userId:id}) ; 
    res.status(201).json({msg:"workspace created" , data : workspace }) 
    return ;
}) 

WorkspaceRouter.put( "" , RoleMiddleware ,  async  (req : AuthorizedRequest , res : Response )  => {   
    const {workspaceId,data} = req.body ; 
    const {role} = req.user ; 
    if(role!=="ADMIN" ) { 
        res.status(404).json({msg:"You are not authorized to performing this action."}) ; 
        return ;
    }
    const workspace = await updateWorkspace( { prisma , data , id : workspaceId }) ; 
    res.status(200).json({msg : "User removed from successfully." , data : workspace}) ; 
})

WorkspaceRouter.put( "/:id/upgrade" , RoleMiddleware ,  async  (req : AuthorizedRequest , res : Response )  => {   
    const id = req.params.id ; 
    if(typeof id !== "number") {
        res.status(404).json("incompatible path param passed") ;  
        return ;
    }
    const {role} = req.user ; 
    if(role!=="ADMIN" ) { 
        res.status(404).json({msg:"You are not authorized to performing this action."}) ; 
        return ;
    }
    const workspace = await updateWorkspace( { prisma , data  : { subscribed : true  }, id :parseInt(id) } ) ; 
    res.status(200).json({msg : "User removed from successfully." , data : workspace}) ; 
})

WorkspaceRouter.delete("" , RoleMiddleware ,  async  (req : AuthorizedRequest , res : Response )  => {   
    const {workspaceId} = req.body ; 
    const {role} = req.user ; 
    if(role!=="ADMIN" ) { 
        res.status(404).json({msg:"You are not authorized to performing this action."}) ; 
        return ;
    }
    await deleteWorkspace({prisma,id:workspaceId}) ;  
    res.status(200).json({msg : "Workspace deleted successfully."}) ; 
}) 


WorkspaceRouter.put("/upsertUser" , RoleMiddleware , async  (req : AuthorizedRequest , res : Response )  => {  
    const {id,role}  = req.user ;   
    if(role!=="ADMIN" ) { 
        res.status(404).json({msg:"You are not authorized to performing this action."}) ; 
        return ;
    }
    const { workspaceId , roleToBeAssigned } = req.body ; 
    if( !roleToBeAssigned || typeof roleToBeAssigned !== "string" ||  ( roleToBeAssigned === "ADMIN" || roleToBeAssigned === "MEMBER" ) ) { 
        res.status(400).json({msg:"Invalid or missing fields in request body"}) ; 
        return ; 
    }
    const dbResponse = await upsertUser({prisma,workspaceId,userId:id, role: roleToBeAssigned === "ADMIN" ? "ADMIN" : "MEMBER"  }) ;  
    return dbResponse ; 
})


WorkspaceRouter.delete("/deleteUser" , RoleMiddleware ,   async  (req : AuthorizedRequest , res : Response )  => {   
    const {userId,workspaceId} = req.body ; 
    const {role} = req.user ; 
    if(role!=="ADMIN" ) { 
        res.status(404).json({msg:"You are not authorized to performing this action."}) ; 
        return ;
    }
    await removeUser({prisma,workspaceId,userId}) ; 
    res.status(200).json({msg : "User removed from successfully."}) ; 
}) 

export { WorkspaceRouter } 