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
            let previousId = nestedAtoms.Id.low;
            nodeArray.forEach(item => {
                if(item.Id !== nestedAtoms.Id){
                    addChildToNestedAtom(nestedAtoms, item, previousId)
                }
                previousId = item.Id.low;
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
                    <h2 className="text-xl">Showing children of: {formatedAtom.Name}</h2>
                    {returnChildList(formatedAtom,0)}
                </>
            }
        </div>
    )
}

function addChildToNestedAtom(nestedAtoms: Atom, item: Atom, previousId: string): boolean {

    if(previousId === nestedAtoms.Id.low) {
        addChild(nestedAtoms,item);
        return true;
    }

    if(nestedAtoms.Children===undefined) return false;

    let atomAdded = false;
    nestedAtoms.Children.forEach(child => {
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
    if(nestedAtoms.Children===undefined) {
        nestedAtoms.Children = [];
    }

    let alreadyAdded =false;
    nestedAtoms.Children.forEach(child=>{
        if(child.Id.low === item.Id.low) {
            alreadyAdded = true;
        }
    })

    if(alreadyAdded) return;

    nestedAtoms.Children.push(item);
}

function returnChildList(formatedAtom:Atom, nestLevel: number):JSX.Element {
    if(formatedAtom.Children === undefined || formatedAtom.Children.length===0) return <></>;
    let children: JSX.Element[] = [];
    formatedAtom.Children.forEach(child =>{
        children.push(<li key={child.Id.low}>{child.Name}</li>)
        if(child.Children !== undefined && child.Children.length!==0){
            children.push(returnChildList(child, nestLevel+1))
        }
    })
    children.push(<li className="text-orange-400" key={"AddAtom"+formatedAtom.Id.low}>Add a new Atom</li>)
    return(
        <ul className={"list-disc list-inside p-"+nestLevel*4} key={"list"+formatedAtom.Id.low}>
            {children}
        </ul>
    )
}