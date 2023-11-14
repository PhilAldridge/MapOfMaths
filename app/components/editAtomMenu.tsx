'use client'
import { useEffect, useState } from "react";

export default function EditMenu({xPos, yPos, nodeId, reDraw}:{xPos:number, yPos:number,nodeId?:string, reDraw: ()=> void}) {
    const [name, setName] = useState("");
    const [type, setType]= useState("Noun");
    useEffect(()=>{
        if(nodeId) {
            getNodeDetails(nodeId);
    
        }
    }, [nodeId]);

    if(nodeId && type===""){
        return (<div className=" bg-slate-950 absolute rounded-md p-1 h-30" style={{top:yPos, left:xPos}}>Loading...</div>)
    }
    
    return(<div className=" bg-slate-950 absolute rounded-md p-1" style={{top:yPos, left:xPos}}>
        <p className="p-2"><label htmlFor="name">Name: </label>
        <input className="rounded-md text-black w-full h-7" type="text" id="name" name="name" value={name} onChange={(e)=>setName(e.target.value)}></input></p>
        <p className="p-2"><label htmlFor="type">Type: </label>
        <select className=" text-black w-full rounded-md h-7" id="type" name="type" onChange={(e)=>setType(e.target.value)} value={type}>
            <option defaultChecked value="Noun">Noun</option>
            <option value="Single-Dimension">Single-Dimension</option>
            <option value="Transformation">Transformation</option>
            <option value="Correlated feature">Correlated feature</option>
            <option value="Double Transforation">Double transformation</option>
        </select>
        </p>
        <button disabled={name==="" || type===""} className="m-2 p-1 rounded-md bg-slate-700 enabled:hover:bg-slate-400" onClick={handleClick}>{nodeId? <>Edit Atom</> : <>Add atom</>}</button>
    </div>)

    async function getNodeDetails(nodeId:string) {
        const result = await fetch(`/api/getId/${nodeId}`);
        const node = await result.json(); 
        setName(node.properties.name);
        setType(node.properties.type);
    }

    async function handleClick() {
        if(nodeId) {
            editNode()
        } else {
            addNode()
        }
    }

    async function editNode() {
        const data = {
            action: 'edit node',
            id: nodeId,
            name: name,
            type:type
    
        }
        await fetch('/api',{
            method: "POST",
            body: JSON.stringify(data)
        })
    
        reDraw();
    }

    async function addNode() {
        const data = {
            action: 'create node',
            name: name,
            type:type
    
        }
        await fetch('/api',{
            method: "POST",
            body: JSON.stringify(data)
        })
    
        reDraw();
    }
}

