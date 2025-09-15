import {  PrismaClient } from "@prisma/client";

export const checkUserExists = async ( {prisma,email}  : { prisma : PrismaClient , email : string  }  ) => {  
    const user = await prisma.user.findFirst({where : { email}}) ; 
    return user ; 
} 

export const createUser = async ( {prisma,email,name,password}  : { prisma:PrismaClient , email : string  , name : string  , password  : string }    )  =>  { 
    await prisma.user.create({ data :  { email , name , password }}) ; 
}

export const getUser = async ({ prisma ,email} : { prisma : PrismaClient , email : string}) => {   
    const dbResponse  = await prisma.user.findFirst({where: {email } , select : { password : true , id : true   } }) ; 
    console.log("user found " + dbResponse) ; 
    return dbResponse ; 
}

export const getUserData = async ({ prisma  , id } : { prisma : PrismaClient , id : number   }) => { 
    const user = await prisma.user.findUnique( { where : { id } , select : { name : true , email : true , workspaces :  {  select : { workspace : { select : { name: true , id : true   }}   } }  }}) ; 
    return user ;  
}