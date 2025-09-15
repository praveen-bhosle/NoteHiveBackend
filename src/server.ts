import express, { Request, Response }   from "express" ; 
import cors from "cors" ; 
import { AuthRouter } from "./routes/AuthRoutes";
import { AuthMiddleWare } from "./middlewares/AuthMiddleware";
import { WorkspaceRouter } from "./routes/WorkspaceRoutes";
import { NotesRouter } from "./routes/NotesRouter";
import { prisma } from "./prisma";
import { UserRouter } from "./routes/UserRoutes";

const app = express() ;
app.use(cors()) ; 
app.use(express.json()) ; 
app.get("/a" , async (req : Request , res:Response) => { 
    await prisma.$connect() ; 
    const x = await prisma.workspacesOnUsers.findUnique({where : { userId_workspaceId : { workspaceId : 2 , userId : 4}  }}) ;
    res.status(200).json({x}) ; 
 } ) 
app.get("/health", (res:Response) => { res.status(200).json({status : "ok"})}) ; 
app.use("/auth" , AuthRouter) ; 
app.use(AuthMiddleWare) ; 
app.use("/users" , UserRouter ) ; 
app.use("/tenants" , WorkspaceRouter ) ; 
app.use("/notes",NotesRouter) ; 

app.listen( 8000 , () => { console.log("server running") } )  ;