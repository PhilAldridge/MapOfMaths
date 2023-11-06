import React from 'react'
import { useRouter } from 'next/navigation'

function LogoutButton() {
    const router = useRouter();
  return (
    <div className=' absolute w-full text-right'>
        <button onClick={handleClick} className=' m-4 border-2 rounded-md border-violet-600 bg-gradient-to-tr from-indigo-400 to-indigo-800 p-1 hover:from-indigo-100 hover:to-indigo-400 hover:text-black'>Logout</button>
  
    </div>
    )

  async function handleClick() {
    await fetch('/api/auth/signout?callbackUrl=/api/auth/session',{
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
        },
        body: await fetch('/api/auth/csrf').then(rs=>rs.text())
    })
    router.refresh();
}
}

export default LogoutButton

