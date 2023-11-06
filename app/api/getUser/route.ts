import { NextRequest } from "next/server"

export function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if(!token) return;
    return Response.json({message:"success"})
}