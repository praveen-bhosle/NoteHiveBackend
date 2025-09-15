import { Response, Router } from "express";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthorizedRequest } from "AuthorizedRequest";
import { prisma }  from  "../prisma" ; 
import { createNote, deleteNote, getNote, getNotes, getNumberOfNotes, updateNote } from "../services/NotesService";
import { checkIfSubscribed } from "../services/WorkspaceService";

const NotesRouter = Router() ; 

NotesRouter.use(RoleMiddleware) ; 

NotesRouter.get("/", async (req:AuthorizedRequest , res : Response) => { 
    try { 
        const notes = await getNotes({prisma, workspaceId : req.context.workspaceId }) ;  
        res.status(200).json({msg:"Notes accessed." , data : notes }) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
}) 

NotesRouter.get("/:id" , async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        const id = parseInt(req.params.id) ; 
        if(isNaN(id)) { 
            res.status(404).json({msg:"Note not found."}) ;
            return ;
        } 
        const note = await getNote({prisma,id}) ;  
        if(!note) { 
            res.status(404).json({msg:"Note not found."}) ;
            return ; 
        }
        res.status(200).json({msg:"Note accessed." , data : note }) ;  
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
}) 

NotesRouter.post("/" , async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        const { title , content } = req.body ;     
        if( !title || typeof title !== "string" || typeof content !== "string" ) { 
            res.status(400).json({msg:"Invalid or missing fields in body."}) ;
            return ;
        } 
        const subscribed = await checkIfSubscribed({prisma,id: req.context.workspaceId }) ;
        const count_of_notes = await getNumberOfNotes({prisma, workspaceId  : req.context.workspaceId }) ; 
        if( !subscribed && count_of_notes > 3 ) { 
            res.status(200).json({msg:"You have exceeded the limit to create notes. Switch to premium." }) ;
            return ; 
        } 
        const note = await createNote({prisma, data : {title , content , workspaceId : req.context.workspaceId}}) ;  
        res.status(200).json({msg:"Note created successfully." , data : note }) ;  
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
}) 

NotesRouter.put("/:id",   async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        const { title , content } = req.body ; 
        const id = parseInt(req.params.id) ;    
        if( isNaN(id) ||  typeof title !== "string" || typeof content !== "string" ) { 
            res.status(400).json({msg:"Invalid or missing fields in body or params."}) ;
            return ;
        } 
        const note = await updateNote({prisma, data : {title , content  } , id  }) ;  
        res.status(201).json({msg:"Note updated." , data : note }) ;
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
})    

NotesRouter.delete("/:id",  async  (req  : AuthorizedRequest  , res : Response)=> {  
    try { 
        const id = parseInt(req.params.id) ; 
        if(isNaN(id)) { 
            res.status(400).json("incompatible path param passed") ;  
            return ;
        } 
        await deleteNote({prisma, id  }) ;  
        res.status(200).json({msg:"Note deleted."}) ;  
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
})    



export {NotesRouter} ; 