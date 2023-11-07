import {read} from '../../lib/neo4j'



export async function GET(request: Request, {params} : {params: { atomId: string}}) {
    const id = params.atomId;
    const result = await read<AtomResult>(`MATCH path=(:Atom {id:'${id}'})-[:dependsOn*]->(:Atom) WITH nodes(path) AS a UNWIND a as atoms return atoms`, {});
    let response: Atom[] = []
    result.forEach(item => {
        response.push(item.atoms.properties);
    })
    return Response.json(response)
}