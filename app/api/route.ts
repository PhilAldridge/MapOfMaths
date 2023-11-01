import {read, readWholeGraph, write} from '../lib/neo4j'

interface GraphResult {
//TODO check form neaded for regraph
}

export async function GET(request: Request) {
    const result = await readWholeGraph<GraphResult>(`MATCH (n)-[r:dependsOn]->(m) RETURN *`, {});
    return Response.json(result)
}