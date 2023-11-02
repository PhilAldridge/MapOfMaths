'use client'

import React, { useEffect, useState } from "react";


export default function AtomPage({params}: {params: {atomId:string}}) {
    const [formatedAtom, setFormatedAtom] = useState<Atom>();
    useEffect(() =>{
        fetch(`/api/${params.atomId}`)
        .then(res => res.json())
        .then(json => {
            const nodeArray: Atom[] = json;
            let nestedAtoms = nodeArray[0];
            nodeArray.shift();
            let previousId = nestedAtoms.id.low;
            nodeArray.forEach(item => {
                if(item.id !== nestedAtoms.id){
                    addChildToNestedAtom(nestedAtoms, item, previousId)
                }
                previousId = item.id.low;
            })
            setFormatedAtom(nestedAtoms);
        })
    },[params.atomId])

    return (
        <div className="p-4">
            {formatedAtom===undefined? 
                <p>Loading...</p>
                :
                <> 
                    <h2 className="text-xl">Showing children of: ✏️{formatedAtom.name} ..Delete Node..</h2>
                    {returnChildList(formatedAtom,0)}
                </>
            }
        </div>
    )
}

function addChildToNestedAtom(nestedAtoms: Atom, item: Atom, previousId: string): boolean {

    if(previousId === nestedAtoms.id.low) {
        addChild(nestedAtoms,item);
        return true;
    }

    if(nestedAtoms.children===undefined) return false;

    let atomAdded = false;
    nestedAtoms.children.forEach(child => {
        if(!atomAdded && addChildToNestedAtom(child, item, previousId)){
            atomAdded = true;
        }
    })

    if(atomAdded){
        return true;
    }
    return false;
}

function addChild(nestedAtoms: Atom, item: Atom) {
    if(nestedAtoms.children===undefined) {
        nestedAtoms.children = [];
    }

    let alreadyAdded =false;
    nestedAtoms.children.forEach(child=>{
        if(child.id.low === item.id.low) {
            alreadyAdded = true;
        }
    })

    if(alreadyAdded) return;

    nestedAtoms.children.push(item);
}

function returnChildList(formatedAtom:Atom, nestLevel: number):JSX.Element {
    if(formatedAtom.children === undefined || formatedAtom.children.length===0) return <></>;
    let children: JSX.Element[] = [];
    formatedAtom.children.forEach(child =>{
        children.push(<li key={child.id.low}>✏️{child.name} <span className="">✏️{child.type}</span> x</li>)
        if(child.children !== undefined && child.children.length!==0){
            children.push(returnChildList(child, nestLevel+1))
        }
    })
    children.push(<li className="text-orange-400" key={"AddAtom"+formatedAtom.id.low}>Add a new Atom</li>)
    return(
        <ul className={"list-disc list-inside p-"+nestLevel*4} key={"list"+formatedAtom.id.low}>
            {children}
        </ul>
    )
}