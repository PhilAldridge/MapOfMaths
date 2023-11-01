'use client'
import dynamic from 'next/dynamic'

const Graph = dynamic(()=> import("@/app/components/graph"),{ssr:false})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-100">
      <Graph />
    </main>
  )
}
