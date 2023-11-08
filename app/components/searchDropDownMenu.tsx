'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import {  ReactElement } from "react";

type AtomData = {
    _fields: string[]
}

function SearchDropDownMenu({atoms, input}:{atoms:AtomData[], input:string}) {
    let children: ReactElement[]  = [];
    const router = useRouter();
    atoms.forEach(atom =>{
        if(atom._fields[0].includes(input)){
            children.push(<Link href={'/learningAtom/'+atom._fields[1]} className="bg-black bg-opacity-0 hover:bg-violet-800 hover:bg-opacity-30" key={'search'+atom._fields[1]}>{atom._fields[0]}</Link>)
        }
    })
  return (
    <div className="absolute flex flex-col pt-4 z-50 h-60 overflow-y-scroll overflow-x-clip rounded-md bg-gradient-to-tr from-violet-600 to-pink-600 p-1">
        {children}

    </div>
  )
}

export default SearchDropDownMenu