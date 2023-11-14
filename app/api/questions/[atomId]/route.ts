import {read,write} from '@/app/lib/neo4j'
import { authorisedUser } from '@/app/lib/auth';

interface GraphResult {
    //TODO check form neaded for regraph
    }
    
export async function GET(request: Request, {params} : {params: { atomId: string}}) {
    const id = params.atomId;    
    const result = await read<GraphResult>(`MATCH (:Atom {id:"${id}"})<-[:checks]->(m:Question) RETURN m`, {});
    return Response.json(result)
}

export async function POST(request: Request){
    const authorized = await authorisedUser();
    if(await !authorized){
         return new Response(new Blob(),{status: 401, statusText:"You are not authorized to perform this action" });
    }

    const requestBody = await request.json();
    const errorResponse = new Response(new Blob(),{status: 400, statusText:"Bad Request"})
    if(!requestBody.question || !requestBody.answer || !requestBody.atomId) return errorResponse;
    const createNodeResult = await write<GraphResult>(`MATCH (n:Atom {id:"${requestBody.atomId}"}) CREATE (m:Question {question:"${requestBody.question}", answer:"${requestBody.answer}",id:randomUUID()})-[:checks]->(n)`,{})
            return Response.json(createNodeResult);
}