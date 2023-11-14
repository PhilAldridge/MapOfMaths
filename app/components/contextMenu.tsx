import { useEffect, useState } from "react";
import Link from "next/link"
import { useSession } from "next-auth/react";


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
    const [atomId, setAtomId] = useState(null);
    const session = useSession();
    const admin = session.data?.user?.email === "phil_mj12@yahoo.co.uk";
    useEffect(()=>{
        if(!nodeId) return;
        const fetchNode = async () => {
            const result = await fetch(`/api/getId/${nodeId}`);
            const node = await result.json(); 
            setAtomId(node.properties.id);
        }
        fetchNode();
        
    },[nodeId])

    if(!admin && !nodeId) return (<></>);

    return(
       
        <ul className=" bg-slate-950 absolute rounded-md p-1" style={{top:yPos, left:xPos}}>
            {nodeId?
                <>
                    {admin && <><li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>{deleteElement(nodeId,"node")}}>Delete Atom</li>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>nodeEditMenu()}>Edit Atom</li>
                    <li className="hover:bg-slate-700 hover:cursor-pointer" onClick={()=>dependsMenu()}>Depends On...</li></>}
                    {atomId?
                         <li className="hover:bg-slate-700 hover:cursor-pointer" ><Link href={'/learningAtom/'+atomId}>View details</Link></li>
                        :
                        <li className="text-slate-300">View details</li>}
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
    }

}
