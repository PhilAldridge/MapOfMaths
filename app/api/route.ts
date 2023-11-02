import {read, readWholeGraph, write} from '../lib/neo4j'

interface GraphResult {
//TODO check form neaded for regraph
}

export async function GET() {
    const result = await readWholeGraph<GraphResult>(`MATCH (n)-[r]->(m) RETURN n,r,m`, {});
    const result2 = await readWholeGraph<GraphResult>(`MATCH (n) WHERE NOT ()-[]->(n) RETURN n`,{})
    return Response.json([...result,...result2])
}

export async function POST(request: Request){
    //Allowed operations 'create node', 'create connection'
    const result = await request.json();
    const errorResponse = new Response(new Blob(),{status: 400, statusText:"Bad Request"})
    switch (result.action) {
        case 'create node':
            if(!result.name || !result.type) return errorResponse;
            const createNodeResult = await write<GraphResult>(`CREATE (a:Atom {name: '${result.name}', type:'${result.type}',id:randomUUID()}) return a`,{})
            return Response.json(createNodeResult);
        case 'create connection':
            if(!result.id || !result.dependsOnId) return errorResponse;
            const connectResult = await write<GraphResult>(`MATCH(a: Atom {id:'test 100'})
            MATCH(b:Atom {name:'test 1030'})
            WHERE NOT (a)-[:dependsOn]->(b) 
            MERGE(a)-[r:dependsOn]->(b)
            RETURN r`,{})
            return Response.json(connectResult);
        case 'edit node':
            if(!result.id || !result.dependsOnId) return errorResponse;
            const editResult = await write<GraphResult>(``,{})
            return Response.json(editResult);
        default: 
            return errorResponse;

    }
}

