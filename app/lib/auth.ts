import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';

const key = process.env.JWT_KEY as string

export async function verifyToken(token:string):Promise<boolean>{
    console.log(cookies().get('token'))
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