import { useRouter } from "next/navigation";

export default function ContextMenu({
    xPos, yPos, nodeId, edgeId, nodeEditMenu, dependsMenu, reDraw}
    : {
        xPos: number;
        yPos: number;
        nodeId?: string;
        edgeId?: string;
        nodeEditMenu: ()=>void;
        dependsMenu: ()=>void;
        reDraw: ()=>void
     }){
    const router = useRouter();
    return(
        <ul className=" bg-slate-950 absolute rounded-md p-1" style={{top:yPos, left:xPos}}>
            {nodeId?
                <>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>{deleteElement(nodeId,"node")}}>Delete Atom</li>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>nodeEditMenu()}>Edit Atom</li>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>dependsMenu()}>Depends On...</li>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>viewAtom(nodeId)}>View details</li>
                </>
                :
                edgeId?
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>{deleteElement(edgeId,"edge")}}>Delete Edge</li>
                    :
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>{nodeEditMenu()}}>Add Atom</li>
            }
        </ul>
    )

    async function deleteElement(id: string, action:string){
        const data = {
            action: action,
            id: id
    
        }
        await fetch('/api',{
            method: "DELETE",
            body: JSON.stringify(data)
        })
        reDraw();
        //location.reload();
    }

    async function viewAtom(nodeId:string) {
        const result = await fetch(`/api/getId/${nodeId}`);
        const node = await result.json(); 
        router.push(`/learningAtom/${node.properties.id}`)
    }
}

