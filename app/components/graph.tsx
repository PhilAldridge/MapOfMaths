'use client'
import NeoVis, { NeoVisEvents } from 'neovis.js'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Graph() {
  
  const router = useRouter();
  useEffect(()=>{
    const config = {
      containerId: "viz",
      dataFunction: getGraphData,
      labels: {
        Atom: {
          label: 'name',
          group: 'type'
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
    console.log()
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
      <div id="viz" className=' w-screen h-screen p-4 text-lg'></div>
  )
}

async function getGraphData() {
  return (await fetch(`/api`)).json();
}
