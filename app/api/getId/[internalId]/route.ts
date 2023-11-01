import {read} from '../../../lib/neo4j'

export async function GET(request: Request, {params} : {params: { internalId: string}}) {
    const id = params.internalId;
    const result = await read<IdLowHigh[]>(`MATCH (n:Atom) WHERE id(n)=${id} RETURN n.Id`, {});
    return Response.json(result[0][<any>"n.Id"].low)
}