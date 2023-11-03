'use client'
import dynamic from 'next/dynamic'

const Graph = dynamic(()=> import("@/app/components/graph"),{ssr:false})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-slate-800 to-slate-950">
      <div className='h-72  w-full text-center justify-center flex items-center text-6xl font-bold tracking-wide'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-800 hover:to-violet-600 transition duration-500'>Map of Mathematics</span></div>
      <Graph />
    </main>
  )
}
