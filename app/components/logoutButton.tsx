import React from 'react'
import { useRouter } from 'next/navigation'

function LogoutButton() {
    const router = useRouter();
  return (
    <div className=' absolute w-full text-right z-50'>
        <button onClick={handleClick} className=' active:translate-y-px active:brightness-75 m-4 border-2 rounded-md border-violet-900 bg-gradient-to-tr from-pink-400 to-violet-800 p-1 hover:from-pink-100 hover:to-violet-400 hover:text-black'>Logout</button>
  
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

