'use client'
import { useRouter } from 'next/navigation'

function LogoutButton() {
    const router = useRouter();
  return (
        <button onClick={handleClick} className='hover:bg-opacity-30 p-2 rounded-md bg-violet-700 bg-opacity-0 h-10 align-middle my-auto'>Logout</button>
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

