'use client'
import Link from 'next/link'
import{useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'

type DataExpected = {
    m: {
        properties: Sanitized
    }
}

type Sanitized = {
    question: string;
    answer: string;
    id:string
}

export default function QuestionList({atomId, updateInitial}: {atomId:string, updateInitial:number}) {
    const [questions, setQuestions] = useState<Sanitized[]>();
    const [update,setUpdate] = useState(updateInitial);
        
    const session = useSession();
    const admin = session.data?.user?.email === "phil_mj12@yahoo.co.uk";

    useEffect(()=>{
        const getQuestions =async () => {
            const result = await fetch('/api/questions/'+atomId);
            const data: DataExpected[] = await result.json()
            
            const sanitizedData = data.map(item=> item.m.properties)
            setQuestions(sanitizedData)
        }

        getQuestions();
    },[atomId, update, updateInitial])


    return (
        <div className="p-2 rounded-xl border-2 border-slate-200 bg-slate-800">
            <h1 className=" text-2xl mb-2">Questions</h1>
            <ul className="list-disc list-inside">
                {
                    (questions && questions.length>0)?
                    questions.map((item,index)=>
                            <div className='gap-3 flex px-2 py-1' key={"question"+index}>
                                &#x2022; {item.question}
                                <Link href={'/question/'+item.id} className='ml-auto bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 h-full w-fit rounded-md active:translate-x-px'>Try it</Link>
                                {admin&& <button onClick={()=>{handleDelete(item.id)}} className="bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit rounded-md active:translate-x-px">Delete</button>}
                            </div>
                        ):
                    <p>There are no questions for this atom</p>
                }
            </ul>
            <div className='w-full text-center p-4'>
            <Link href={'/question/byAtom/'+atomId} className='ml-auto bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 h-full w-fit rounded-md active:translate-x-px'>Try mixed questions</Link>
              </div>                 
        </div>
    )

    function forceUpdate() {
        setUpdate(update => update+1)
    }

    async function handleDelete(id:string) {
        await fetch('/api',{
            method: "DELETE",
            body: JSON.stringify({
                action: "nodeexternalid",
                id: id
            })
        })
        forceUpdate()
    }
}