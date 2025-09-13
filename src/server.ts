import express, { Response }   from "express" ; 
import cors from "cors" ; 
import { AuthRouter } from "./routes/AuthRoutes";
import { AuthMiddleWare } from "./middlewares/AuthMiddleware";
import { WorkspaceRouter } from "./routes/WorkspaceRoutes";
import { NotesRouter } from "./routes/NotesRouter";

const app = express() ;
app.use(cors()) ; 
app.use(express.json()) ; 
app.get("/health", (res:Response) => { res.status(200).json({status : "ok"})}) ; 
app.use("/auth" , AuthRouter) ; 
app.use(AuthMiddleWare) ; 
app.use("/tenants" , WorkspaceRouter ) ; 
app.use("/notes",NotesRouter) ; 

app.listen( 8000 , () => { console.log("server running") } )  