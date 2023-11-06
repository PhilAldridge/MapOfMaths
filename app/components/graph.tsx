'use client'
import NeoVis, { NeoVisEvents } from 'neovis.js'
import React, { useEffect, useState } from 'react'
import ContextMenu from './contextMenu';
import EditMenu from './editAtomMenu';

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
    const [neoviz, setNeoviz] = useState<NeoVis>()
    useEffect(()=>{
      const config = {
        containerId: "viz",
        dataFunction: getGraphData,
        labels: {
          Atom: {
            label: 'name',
            group: 'type',
            value: 'score',
            size: 'score'
          }
        },
        visConfig:{
          nodes:{
            shape:'dot',
            //font: "14px verdana black",
            font: {
              size: 14,
              face: 'verdana',
              color: 'black',
              strokeWidth: 0
            }
          },
          edges:{
            arrows: {
              to: {enabled:true}
            }
          }
        },
        
      }
      setNeoviz(new NeoVis(config));
    },[])

    if(neoviz){
      neoviz.render();
      neoviz.registerOnEvent("completed" as NeoVisEvents, (e:any):void=>{
        neoviz.network?.on("oncontext", async(event) => {
          setEvent(event as NeoVisClickEvent)
          setConnecting(false);
          setEditting(false);
        })
        neoviz.network?.on("click",async(e) => {
          if(connecting && e.nodes.length>0 && e.nodes[0]!== event.nodes[0]) {
            addDependsOn(e.nodes[0])
          } else {
            setEvent(e as NeoVisClickEvent);
          }
          setConnecting(false);
          setEditting(false);
        })
      })
    }
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
            dependsMenu={()=>{connectMenu()}}
            reDraw={()=>reDrawWithClear()}
          />
        }
        {editting &&
          <EditMenu 
            xPos = {event.pointer.DOM.x+64}
            yPos={event.pointer.DOM.y+288}
            nodeId={event.nodes[0]}
            reDraw={()=>reDraw()}
          />
        }
        {connecting &&
          <div className='absolute top-72 mt-1 bg-slate-600 rounded-md p-1'>Click the atom that this atom depends on... <button className=' bg-violet-900 ml-10 rounded-xl w-6 h-7 font-bold hover:bg-violet-500' onClick={()=>setConnecting(false)}>X</button></div>
        }
    </>
  )

  function editMenu() {
    setEditting(true);
    setEvent({...event,items:[]})
  }

  function connectMenu() {
    setConnecting(true);
    setEvent({...event, items:[]})
  }

  async function addDependsOn(dependsOnId:string){
    const data = {
      action:"create connection",
      atomId: event.nodes[0],
      dependsOnId: dependsOnId
    }
    await fetch('/api',{
      method: "POST",
      body: JSON.stringify(data)
    })
    neoviz?.render();
  }

  function reDraw() {
    neoviz?.render();
    setConnecting(false);
    setEditting(false);
    setEvent({...event,items:[]})
  }

  function reDrawWithClear() {
    neoviz?.clearNetwork();
    reDraw()
  }
}

async function getGraphData() {
  return (await fetch(`/api`)).json();
}
