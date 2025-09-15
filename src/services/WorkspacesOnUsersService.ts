import {  PrismaClient, Role } from "@prisma/client";

export const getUserRole = async ( {prisma,workspaceId , userId }  : { prisma : PrismaClient , workspaceId : number , userId : number}) => {  
    const dbResponse = await prisma.workspacesOnUsers.findFirst({where : { workspaceId , userId} , select : { role : true }}) ;  
    return dbResponse?.role ; 
}

export const upsertUser = async ( {prisma,workspaceId , userId , role  }  : { prisma : PrismaClient , workspaceId : number , userId : number  , role : Role}) => {  
    const dbResponse = await prisma.workspacesOnUsers.upsert({
        where : { 
            userId_workspaceId : { 
                workspaceId , userId 
            }
        } , 
        update : { 
            role 
        } , 
        create : { 
            userId , 
            workspaceId , 
            role 
        }
    }) ;  
    return dbResponse ; 
}

export const removeUser = async ( {prisma,workspaceId,userId}  : { prisma : PrismaClient , workspaceId : number , userId : number }) => {  
    await prisma.workspacesOnUsers.delete({ 
        where : { 
            userId_workspaceId : { 
                workspaceId , 
                userId 
            }
        }
    })
}

export const getUserWorkspaces = async ({prisma,userId} : { prisma : PrismaClient , userId : number } ) => { 
    const dbResponse = await prisma.workspacesOnUsers.findMany( { where : { userId }  , select : { workspaceId : true , role : true , workspace : { select : { name : true }}}  })  ; 
    const updatedResponse = dbResponse.map( (e) => ( { role : e.role , id : e.workspaceId  ,  name : e.workspace.name } ) )
    return updatedResponse  ;  
}