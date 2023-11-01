'use client'
import NeoVis, { NeoVisEvents } from 'neovis.js'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type GraphNode = {
  id: string;
  x: number;
  y: number; 
  label: string
}

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    const config = {
      containerId: "viz",
      dataFunction: getGraphData,
      labels: {
        Atom: {
          label: 'Name',
          group: 'TypeId'
        }
      },
      visConfig:{
        nodes:{
          font: "14px verdana black",
        },
      },
      
    }

    let neoViz = new NeoVis(config);
    neoViz.render();

    neoViz.registerOnEvent("completed" as NeoVisEvents, (e:any):void=>{
      neoViz.network?.on("selectNode", async (event) => {
        const internalId= event.nodes[0];
        const result = await fetch(`/api/getId/${internalId}`);
        const id = await result.json();
        router.push(`/admin/${id}`)
      })
    })
  },[router])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-100">
      <div id="viz" className=' w-screen h-screen p-4 text-lg'></div>
    </main>
  )
}

async function getGraphData() {
  return (await fetch(`/api`)).json();
}
