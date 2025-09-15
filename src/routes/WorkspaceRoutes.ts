import { Response, Router } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { prisma } from "../prisma";
import { checkWorkspaceExists, createWorkspace, deleteWorkspace, updateWorkspace } from "../services/WorkspaceService";
import { getUserWorkspaces, removeUser, upsertUser } from "../services/WorkspacesOnUsersService";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthorizedRequest } from "AuthorizedRequest";
import { getUser } from "../services/UserService";

const WorkspaceRouter = Router() ;  

WorkspaceRouter.post("" , async  (req : AuthenticatedRequest  , res : Response )  => {  
    try {
        const { id  } =  req.user ;  
        const { workspaceName }  = req.body  ; 
        if(!workspaceName) { 
            res.status(400).json({msg:"The field workspaceName is not present in the request body."}) ; 
            return ; 
        }
        const workspaceExists = await checkWorkspaceExists({prisma,name:workspaceName, userId : id }) ;  
        if(workspaceExists) { 
            res.status(409).json({msg:"The workspace name is alredy taken"}) ; 
            return ; 
        }
        const workspace = await createWorkspace({prisma,name:workspaceName,userId:id}) ; 
        res.status(201).json({msg:"workspace created" , data : workspace }) 
        return ;
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
}) 

WorkspaceRouter.put( "/:id/upgrade" , RoleMiddleware ,  async  (req : AuthorizedRequest , res : Response )  => {  
    try { 
        const id = req.params.id ; 
        const parsedId = parseInt(id) ; 
        if(isNaN(parsedId)) {
            res.status(400).json("incompatible path param passed") ;  
            return ;
        }
        const {role} = req.user ; 
        if(role!=="ADMIN" ) { 
            res.status(403).json({msg:"You are not authorized to performing this action."}) ; 
            return ;
        }
        const workspace = await updateWorkspace( { prisma , data  : { subscribed : true  }, id : parsedId } ) ; 
        res.status(200).json({msg : "User removed from successfully." , data : workspace}) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
})

WorkspaceRouter.delete("" , RoleMiddleware ,  async  (req : AuthorizedRequest , res : Response )  => {   
    try {
        const workspaceId = req.context.workspaceId ; 
        const {role} = req.user ; 
        if(role!=="ADMIN" ) { 
            res.status(403).json({msg:"You are not authorized to performing this action."}) ; 
            return ;
        }
        await deleteWorkspace({prisma,id:workspaceId}) ;  
        res.status(200).json({msg : "Workspace deleted successfully."}) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
}) 


WorkspaceRouter.put("/upsertUser" , RoleMiddleware , async  (req : AuthorizedRequest , res : Response )  => {  
    try { 
        const {role}  = req.user ;   
        if(role!=="ADMIN" ) { 
            res.status(403).json({msg:"You are not authorized to performing this action."}) ; 
            return ;
        }
        const { roleToBeAssigned , userEmail } = req.body ; 
        const user = await getUser({prisma,email:userEmail}) ; 
        if(!user) { 
            res.status(400).json({msg:"the user email does not exist."}) ; 
            return ; 
        } 
        if(  !roleToBeAssigned || typeof roleToBeAssigned !== "string" ||  !( roleToBeAssigned === "ADMIN" || roleToBeAssigned === "MEMBER" ) || !userEmail  || typeof userEmail !== "string" ) { 
            res.status(400).json({msg:"Invalid or missing fields in request body"}) ; 
            return ; 
        } 
        const dbResponse = await upsertUser({prisma,workspaceId : req.context.workspaceId, userId : user.id   , role: roleToBeAssigned === "ADMIN" ? "ADMIN" : "MEMBER"  }) ;
        console.log(dbResponse) ;   
        res.status(201).json({msg:"User added" , data : dbResponse}) ; 
        return ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
})


WorkspaceRouter.delete("/deleteUser" , RoleMiddleware ,   async  (req : AuthorizedRequest , res : Response )  => {   
    try { 
        const {userId} = req.body ; 
        const {role} = req.user ; 
        if(role!=="ADMIN" ) { 
            res.status(403).json({msg:"You are not authorized to performing this action."}) ; 
            return ;
        }
        const parsedUserId = parseInt(userId) ; 
        if(isNaN(parsedUserId)) { 
            res.status(400).json("incompatible path param passed") ;  
            return ;
        } 
        await removeUser({prisma,workspaceId : req.context.workspaceId,userId : parsedUserId }) ; 
        res.status(200).json({msg : "User removed from successfully."}) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
}) 

WorkspaceRouter.get('/all' ,  async  (req : AuthenticatedRequest, res : Response ) =>  {   
    try {  
        const {id} = req.user ; 
        const workspaces = await getUserWorkspaces({prisma , userId : id }) ; 
        res.status(200).json({msg : "Got the workspaces." , data : workspaces }) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error."}) 
    }
}
)





export { WorkspaceRouter } 