import {  PrismaClient } from "@prisma/client";

export const checkWorkspaceExists = async ( {prisma,name , userId  }  : { prisma : PrismaClient , name : string , userId : number     }  ) => {  
    const user = await prisma.workspace.findFirst({where : {name , users : {  some  : {  userId  } } }}) ; 
    return user === null ; 
} 

export const createWorkspace = async ( {prisma,name , userId }  : { prisma:PrismaClient , name : string , userId : number  }    )  =>  { 
    const workspace = await prisma.workspace.create({  
        data :  { 
            name , 
            users : { 
                create : { 
                    user : { connect : { id : userId  } } , 
                    role : "ADMIN"
                } , 
            }
        }
    }) ; 
    return workspace ; 
}

export const  deleteWorkspace =  async ( { prisma,id  }  : { prisma : PrismaClient , id : number    }  ) => {  
    await prisma.workspace.delete({where:{id}}) ;  
} 

export const updateWorkspace =  async ( {prisma,  id ,  data  }  : { prisma : PrismaClient , id : number , data : {  name? : string , subscribed? : boolean  }}) => {  
    const dbResponse = await prisma.workspace.update({where:{id},data : { ...data , updatedAt : new Date() } }) ; 
    return dbResponse ; 
} 


export const checkIfSubscribed =   async ( {prisma,  id }  : { prisma : PrismaClient , id : number}) => {  
    const dbResponse = await prisma.workspace.findUnique( { where : {id} , select : { subscribed : true } })  ; 
    return dbResponse && dbResponse.subscribed  ; 
} 