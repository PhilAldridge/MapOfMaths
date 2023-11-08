import {readWholeGraph, write} from '../lib/neo4j'

interface GraphResult {
//TODO check form neaded for regraph
}

export async function GET() {
    const result = await readWholeGraph<GraphResult>(`MATCH (n:Atom)-[r:dependsOn]->(m) RETURN n,r,m`, {});
    const result2 = await readWholeGraph<GraphResult>(`MATCH (n:Atom) WHERE NOT ()-[:dependsOn]->(n) RETURN n`,{})
    return Response.json([...result,...result2])
}

export async function POST(request: Request){
    //Allowed operations 'create node', 'create connection'
    const requestBody = await request.json();
    const errorResponse = new Response(new Blob(),{status: 400, statusText:"Bad Request"})
    switch (requestBody.action) {
        case 'create node':
            if(!requestBody.name || !requestBody.type) return errorResponse;
            const createNodeResult = await write<GraphResult>(`CREATE (a:Atom {name: '${requestBody.name}', type:'${requestBody.type}',id:randomUUID()}) return a`,{})
            return Response.json(createNodeResult);
        case 'create connection':
            if(!requestBody.atomId || !requestBody.dependsOnId) return errorResponse;
            const connectResult = await write<GraphResult>(`MATCH (node1), (node2)
            WHERE id(node1) = ${requestBody.atomId} AND id(node2) = ${requestBody.dependsOnId}
            MERGE (node1)-[r:dependsOn]->(node2) RETURN r`,{})
            return Response.json(connectResult);
        case 'edit node':
            if(!requestBody.id || !requestBody.name || !requestBody.type) return errorResponse;
            const editResult = await write<GraphResult>(`MATCH (n) WHERE id(n)=${requestBody.id} SET n.name = "${requestBody.name}", n.type="${requestBody.type}" RETURN n`,{})
            return Response.json(editResult);
        default: 
            return errorResponse;
    }
}


export async function DELETE(request: Request){
    const requestBody = await request.json();
    
    const errorResponse = new Response(new Blob(),{status: 400, statusText:"Bad Request"})
    if(!requestBody.id) return errorResponse;
    switch (requestBody.action) {
        case "node":
            const deleteNodeRequest = await write<GraphResult>(`MATCH (n) WHERE id(n)=${requestBody.id} DETACH DELETE n`,{});
            return Response.json(deleteNodeRequest);
        case "edge":
            const deleteEdgeRequest = await write<GraphResult>(`MATCH ()-[r]-() WHERE id(r)=${requestBody.id} DELETE r`,{});
            return Response.json(deleteEdgeRequest);
        default:
            return errorResponse;
    }
}
