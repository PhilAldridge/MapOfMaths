import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const key = process.env.JWT_KEY as string;

const saltRounds = 5;
let testhash = '';

bcrypt.hash('test',saltRounds,(err,hash)=>{
    testhash = hash;
})

const USERS = [
    {
        id:1,
        username: "test",
        password: "$2a$05$hnn57Lohc5CvZWvTcoNtEOUuxPX8R3CXFFyJn/DKmo8RDGDkJN.ay"
    }
]

export async function POST(request: Request) {
    const requestBody = await request.json();
    if(!requestBody.username || !requestBody.password) return new Response(new Blob(),{status: 400, statusText:"Bad Request"});

    const user = USERS.find(user => {return user.username === requestBody.username});
    if(!user) return new Response(new Blob(),{status: 400, statusText: 'User not found'});
    

    try {
        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(requestBody.password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    
        // Check the result of the comparison and create a response accordingly
        if (result) {
            // Passwords match
            const payload = {
                id: user.id,
                username: user.username,
            };
            const jwtResult = await new Promise((resolve, reject) => {
                jwt.sign(
                    payload,
                    key,
                    {
                        expiresIn: 60*60*24
                    },
                    (err, token) => {
                        if(err){
                            reject(err)
                        } else {
                            resolve(token)
                        }
                        //const body= JSON.stringify({success:true, token: 'Bearer '+token})
                        //return new Response(new Blob(), {status:400, statusText: "test"})
                    }
                )
            })
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Set-Cookie',`token=${jwtResult}; Path=/;Max-Age=86400;HttpOnly`)
            return new Response(new Blob(), {statusText:"success", headers: headers})
        } else {
            // Passwords do not match
            return new Response(new Blob(), {status:400, statusText: "test2"})
        }
    } catch (error) {
        // Handle any errors that occurred during the comparison
        return new Response(new Blob(), {status:400, statusText: "test3"})
    }
}