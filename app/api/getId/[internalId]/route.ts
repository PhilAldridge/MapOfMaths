import {read} from '../../../lib/neo4j'

export async function GET(request: Request, {params} : {params: { internalId: string}}) {
    const id = parseInt(params.internalId);
    const result = await read<IdLowHigh[]>(`MATCH (n) WHERE id(n)=${id} RETURN n.id`, {});
    return Response.json(result[0][<any>"n.id"])
}