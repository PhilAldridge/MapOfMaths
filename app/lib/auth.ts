import jwt from 'jsonwebtoken'
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

const key = process.env.JWT_KEY as string

export async function verifyToken(token:string):Promise<boolean>{
    try{
        var decoded = await jwt.verify(token, key);
        if(decoded!==null) {
            return true;
        }
        return false;
    }
    catch{
        return false;
    }
}

export async function authorisedUser():Promise<boolean> {
    const session = await getServerSession();
    if(!session || !session.user?.email || session?.user.email !== "phil_mj12@yahoo.co.uk") {
        return false
    }
    return true;
}