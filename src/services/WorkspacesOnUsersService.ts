import {  PrismaClient, Role } from "@prisma/client";

export const getUserRole = async ( {prisma,workspaceId , userId }  : { prisma : PrismaClient , workspaceId : number , userId : number}) => {  
    const dbResponse = await prisma.wokspacesOnUsers.findFirst({where : { workspaceId , userId} , select : { role : true }}) ;  
    return dbResponse?.role ; 
}

export const upsertUser = async ( {prisma,workspaceId , userId , role  }  : { prisma : PrismaClient , workspaceId : number , userId : number  , role : Role}) => {  
    const dbResponse = await prisma.wokspacesOnUsers.upsert({
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
    await prisma.wokspacesOnUsers.delete({ 
        where : { 
            userId_workspaceId : { 
                workspaceId , 
                userId 
            }
        }
    })
} 