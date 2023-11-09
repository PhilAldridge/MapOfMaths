import {read,write} from '@/app/lib/neo4j'

interface GraphResult {
    //TODO check form neaded for regraph
    }
    
export async function GET(request: Request, {params} : {params: { questionId: string}}) {
    const id = params.questionId;    
    const result = await read<GraphResult>(`MATCH (m:Question {id:"${id}"})-[:checks]->(n:Atom) RETURN m,n`, {});
    return Response.json(result)
}