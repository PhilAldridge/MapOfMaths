'use client'
import Banner from "@/app/components/banner";
import HomeButton from "@/app/components/homeButton";
import React, { useEffect, useState } from "react";
const colors: {[key:string]:string} = {
	'Noun':"#d27dff",
	'Single-Dimension':"#ffa000",
	'Transformation':"#d226db",
	'Correlated feature':"#bfc149",
	'Double Transforation':"#594fb5",
};


export default function AtomPage({params}: {params: {atomId:string}}) {
    const [formatedAtom, setFormatedAtom] = useState<Atom>();
    useEffect(() =>{            
            const getData = async () =>  {
                const data = await fetch(`/api/${params.atomId}`);
                const nodeArray: Atom[] = await data.json();
                let nestedAtoms = nodeArray[0];
                nodeArray.shift();
                let previousName = nestedAtoms.name;
                nodeArray.forEach(item => {
                    if(item.name !== nestedAtoms.name){
                        addChildToNestedAtom(nestedAtoms, item, previousName)
                    }
                    previousName = item.name;
                })
                setFormatedAtom(nestedAtoms);
            }
            getData();
    },[params.atomId])

    return (
        <div className="p-4">
            <HomeButton/>
            <Banner />
            {formatedAtom===undefined? 
                <p>Loading...</p>
                :
                <> 
                    <h2 className=" text-3xl m-8 font-bold">Showing children of: <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500" style={{backgroundSize: '100%'}}>{formatedAtom.name}</span></h2>
                    <div className=" w-full bg-slate-800 p-2 rounded-xl border-2 border-slate-200">
                        {returnChildList(formatedAtom,0)}
                    </div>
                    
                </>
            }
        </div>
    )
}

function addChildToNestedAtom(nestedAtoms: Atom, item: Atom, previousName: string): boolean {

    if(previousName === nestedAtoms.name) {
        addChild(nestedAtoms,item);
        return true;
    }

    if(nestedAtoms.children===undefined) return false;

    let atomAdded = false;
    nestedAtoms.children.forEach(child => {
        if(!atomAdded && addChildToNestedAtom(child, item, previousName)){
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
        if(child.name === item.name) {
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
        children.push(<li className="m-2" key={child.name}>{child.name} <span className="ml-4 text-sm p-1 rounded-lg" style={{backgroundColor:colors[child.type]}}>{child.type}</span></li>)
        if(child.children !== undefined && child.children.length!==0){
            children.push(returnChildList(child, nestLevel+1))
        }
    })
    return(
        <ul className={"list-disc list-inside"} style={{paddingLeft:0.5*nestLevel+"rem"}} key={"list"+formatedAtom.name}>
            {children}
        </ul>
    )
}