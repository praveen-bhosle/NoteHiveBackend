import { Response, Router } from "express";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { AuthorizedRequest } from "AuthorizedRequest";
import { prisma }  from  "../prisma" ; 
import { createNote, deleteNote, getNote, getNotes, getNumberOfNotes, updateNote } from "../services/NotesService";
import { checkIfSubscribed } from "../services/WorkspaceService";

const NotesRouter = Router() ; 

NotesRouter.use(RoleMiddleware) ; 

NotesRouter.get("", async (req:AuthorizedRequest , res : Response) => { 
    try {
        await prisma.$connect() ;
        const {workspaceId} = req.body ;   
        const notes = await getNotes({prisma,workspaceId}) ;  
        res.status(200).json({msg:"Notes accessed." , data : notes }) ; 
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
    finally { 
        await prisma.$disconnect() ; 
    }
}) 

NotesRouter.get("/:id" , async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        await prisma.$connect() ;
        const id = req.params.id ; 
        if(typeof id !== "number") { 
            res.status(404).json({msg:"Note not found."}) ;
            return ;
        } 
        const parsedId = parseInt(req.params.id) ; 
        const note = await getNote({prisma,id : parsedId}) ;  
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
    finally { 
        await prisma.$disconnect() ; 
    }
}) 

NotesRouter.post("" , async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        await prisma.$connect() ;
        const {workspaceId , title , content } = req.body ;    
        if( !workspaceId ||  typeof workspaceId !== "number" || !title || typeof title !== "string" || typeof content !== "string" ) { 
            res.status(404).json({msg:"Invalid or missing fields in body."}) ;
            return ;
        } 
        const subscribed = await checkIfSubscribed({prisma,id: workspaceId}) ;
        const count_of_notes = await getNumberOfNotes({prisma, workspaceId  }) ; 
        if( !subscribed && count_of_notes > 3 ) { 
            res.status(200).json({msg:"You have exceeded the limit to create notes. Switch to premium." }) ;
            return ; 
        } 
        const note = await createNote({prisma, data : {title , content , workspaceId}}) ;  
        res.status(200).json({msg:"Note created successfully." , data : note }) ;  
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
    finally { 
        await prisma.$disconnect() ; 
    }
}) 

NotesRouter.put("/:id",   async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        await prisma.$connect() ;
        const {  workspaceId , title , content } = req.body ; 
        const id = req.params.id ;    
        if( typeof id !== "number" &&  !workspaceId ||  typeof workspaceId !== "number" || !title || typeof title !== "string" || typeof content !== "string" ) { 
            res.status(404).json({msg:"Invalid or missing fields in body or params."}) ;
            return ;
        } 
        const parsedId = parseInt(req.params.id) ; 
        const note = await updateNote({prisma, data : {title , content , workspaceId} , id : parsedId}) ;  
        res.status(201).json({msg:"Note updated." , data : note }) ;
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
    finally { 
        await prisma.$disconnect() ; 
    }
})    

NotesRouter.delete("/:id",  async  (req  : AuthorizedRequest  , res : Response)=> {  
    try {
        await prisma.$connect() ;
        const {  workspaceId , title , content } = req.body ; 
        const id = req.params.id ;     
        if( typeof id !== "number" &&  !workspaceId ||  typeof workspaceId !== "number" || !title || typeof title !== "string" || typeof content !== "string" ) { 
            res.status(404).json({msg:"Invalid or missing fields in body or params."}) ;
            return ;
        }  
        const parsedId = parseInt(req.params.id) ; 
        await deleteNote({prisma, id : parsedId }) ;  
        res.status(200).json({msg:"Note deleted."}) ;  
    }
    catch(e) { 
        console.log(JSON.stringify(e)) ; 
        res.status(500).json({msg:"internal server error"}) ; 
        return ; 
    }  
    finally { 
        await prisma.$disconnect() ; 
    }
})    



export {NotesRouter} ; 