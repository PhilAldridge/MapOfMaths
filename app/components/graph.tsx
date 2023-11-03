'use client'
import NeoVis, { NeoVisEvents } from 'neovis.js'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ContextMenu from './contextMenu';

type NeoVisClickEvent = {
    nodes: string[];
    edges: string[];
    pointer: {
        DOM : {
            x: number;
            y: number
        }
    };
    items? : string[]
}
const initialEvent: NeoVisClickEvent = {
  nodes: [],
  edges:[],
  pointer: {
      DOM:{
          x:0,
          y:0
      }
  },
  items: []
  }

export default function Graph() {
    
    const [event, setEvent] = useState(initialEvent);
    const [editting, setEditting] = useState(false);
    const [connecting, setConnecting] = useState(false);
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
    neoViz.registerOnEvent("completed" as NeoVisEvents, (e:any):void=>{

      /*neoViz.network?.on("selectNode", async (event) => {
        /*
        const internalId= event.nodes[0];
        const result = await fetch(`/api/getId/${internalId}`);
        const id = await result.json();
        router.push(`/admin/${id}`)
        
       console.log(event)
      })*/

      neoViz.network?.on("oncontext", async(event) => {
        console.log(event)
        setEvent(event as NeoVisClickEvent)
        /*if(event.nodes.length>0){
            console.log(event.nodes[0])
        } else if(event.edges.length>0){
            console.log(event.edges[0])
        } else {
            console.log("nothing selected")
        }*/
      })

      neoViz.network?.on("click",async(event) => {
        setEvent(event as NeoVisClickEvent)
      })
    })
  },[router])
  return (
    <>
        <div 
          id="viz" 
          className='h-screen mx-16 text-lg bg-slate-400 border-2 border-slate-100 rounded-md hover:bg-slate-300 transition duration-500' 
          onContextMenu={(e:React.MouseEvent<HTMLDivElement>)=>e.preventDefault()}> 
        </div>
        {
          event.items===undefined &&
          <ContextMenu 
            xPos = {event.pointer.DOM.x+64}
            yPos={event.pointer.DOM.y+288}
            nodeId={event.nodes[0]}
            edgeId={event.edges[0]}
            nodeEditMenu={()=>{editMenu()}}
            dependsMenu={()=>{editMenu()}}
          />
        }
    </>
  )

  function editMenu() {
    setEditting(true);
  }
}

async function getGraphData() {
  return (await fetch(`/api`)).json();
}
