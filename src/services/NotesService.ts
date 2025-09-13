import { PrismaClient } from "@prisma/client"

export const getNotes = async({ prisma , workspaceId  } : { prisma : PrismaClient  , workspaceId : number  }) => { 
   const notes =  await prisma.note.findMany({where : { workspaceId  }}) ; 
   return notes ; 
}

export const getNote = async({ prisma , id   } : { prisma : PrismaClient  , id : number  }) => { 
    const note =  await prisma.note.findMany({where : {  id  }}) ;  
    return note ; 
}

export const createNote = async({ prisma , data } : { prisma : PrismaClient  , data : { title : string , content? : string , workspaceId : number  }  }) => { 
    const note =  await prisma.note.create({data}) ;  
    return note ; 
}

export const updateNote = async({ prisma , data , id   } : { prisma : PrismaClient  , data : { title : string , content? : string , workspaceId : number  } , id : number   }) => { 
    const note =  await prisma.note.update( { where : { id } ,  data}) ;  
    return note ; 
}

export const deleteNote = async({ prisma , id } : { prisma : PrismaClient  , id : number  }) => { 
    await prisma.note.delete({where : {id}}) ;   
}

export const getNumberOfNotes = async({ prisma , workspaceId} : { prisma : PrismaClient  , workspaceId : number }) => {
    const count = await prisma.note.count({where :  { workspaceId} }) ; 
    return count ; 
}