'use client'

import React, { useState, useEffect } from "react"
import SearchDropDownMenu from "./searchDropDownMenu";
import { usePathname } from "next/navigation";

function SearchBar() {
    const [atomNames, setAtomNames] = useState();
    const [searchFocus, setSearchFocus] = useState(false);
    const [input, setInput] = useState('');
    const pathnameChange = usePathname();

    useEffect(()=>{
        const getData =async () => {
            const data = await fetch('/api/atomNames');
            const result = await data.json();
            setAtomNames(result)
        }
        getData();
    },[]);

    useEffect(()=> {
        setSearchFocus(false);
    },[pathnameChange]);

  return (
    <div className="relative px-2">
        <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
            type="search" 
            id="atomSearch" 
            className="block w-full p-4 pl-10 text-sm rounded-md text-violet-950" 
            placeholder="Search learning atoms" 
            required 
            onFocus={()=>setSearchFocus(true)} 
            onBlur={(e)=>handleBlur(e)}
            onChange={(e)=>handleChange(e)} 
        />
        {searchFocus && input !== '' && atomNames && <SearchDropDownMenu atoms={atomNames} input={input} />}
    </div>
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    if(event.relatedTarget?.tagName !== 'A') {
        setSearchFocus(false);
    }
  }
}

export default SearchBar