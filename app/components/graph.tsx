'use client'
import NeoVis, { NeoVisEvents } from 'neovis.js'
import React, { useEffect, useState } from 'react'
import ContextMenu from './contextMenu';
import EditMenu from './editAtomMenu';
import { SessionProvider } from 'next-auth/react';

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
    const [hierarchical, setHierarchical] = useState(true);
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
          },
          layout:{
            hierarchical:true
          }
        },
        
        
      }
      const neoviz = new NeoVis(config)
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
      setNeoviz(neoviz);
    },[])

    if(neoviz){
      
    }
  return (
    <>
        <div 
          id="viz" 
          className='h-screen mx-16 text-lg bg-slate-400 border-2 border-slate-100 rounded-md hover:bg-slate-300 transition duration-500' 
          onContextMenu={(e:React.MouseEvent<HTMLDivElement>)=>e.preventDefault()}> 
        </div>
        <SessionProvider>
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
        </SessionProvider>
        <div className='m-4 text-pink-400'>
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-pink-300 before:pointer-events-none 
                  before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] 
                  after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-pink-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] 
                  after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] 
                  checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary 
                  checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] 
                  checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 
                  focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] 
                  focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary 
                  checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] 
                  checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-pink-600 checked:bg-opacity-50 dark:after:bg-pink-400 dark:checked:bg-primary dark:checked:after:bg-primary 
                  dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault" 
            defaultChecked={!hierarchical}
            onChange={switchGraphMode}/>
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="flexSwitchCheckDefault"
          >Toggle Hierarchical View</label>
    </div>
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
    reDraw();
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

  function switchGraphMode(){
    const newconfig = {
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
        },
        layout:{
          hierarchical:!hierarchical
        }
      },
      
      
    }
    const viz = new NeoVis(newconfig)
    viz.render()
    setHierarchical(!hierarchical)
    setNeoviz(viz);
  }
}

async function getGraphData() {
  return (await fetch(`/api`)).json();
}