'use client'
import dynamic from 'next/dynamic'
import Banner from './components/banner'

const Graph = dynamic(()=> import("@/app/components/graph"),{ssr:false})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <Banner />
      <Graph />
    
    </main>
  )
}


