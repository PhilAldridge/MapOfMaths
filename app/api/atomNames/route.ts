import { readWholeGraph } from "@/app/lib/neo4j";

interface GraphResult {
    //TODO check form neaded for regraph
    }

export async function GET() {
    const result = await readWholeGraph<GraphResult>(`MATCH (n:Atom) RETURN n.name, n.id`, {});
    return Response.json(result)
}