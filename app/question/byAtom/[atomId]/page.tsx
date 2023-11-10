'use client'
import Banner from '@/app/components/banner'
import ConcreteQuestion from '@/app/components/concreteQuestion'
import Link from 'next/link'
import{useState, useEffect} from 'react'

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

export default function QuestionsByAtomPage({params}: {params: {atomId:string}}) {
    const [questions, setQuestions] = useState<Sanitized[]>();
    const [keyVal, setKeyVal] = useState(0)

    useEffect(()=>{
        const getQuestions =async () => {
            const result = await fetch('/api/questions/'+params.atomId);
            const data: DataExpected[] = await result.json()
            
            const sanitizedData = data.map(item=> item.m.properties)
            setQuestions(sanitizedData)
        }

        getQuestions();
    },[params.atomId])


    return (
        <div className="p-4 flex flex-col gap-8">
            <Banner />
            <div className="p-2 rounded-xl border-2 border-slate-200 bg-slate-800">
                <h1 className=" text-2xl mb-2">Mixed Questions</h1>
                <h2 className='text-xl mb-2 text-slate-300'><Link className=' text-pink-300 hover:text-pink-200' href={'/learningAtom/'+params.atomId}>Back to learning atom</Link></h2>
                <ul className="list-disc list-inside">
                    {
                        (questions && questions.length>0)?
                        questions.map((item,index)=>
                                <ConcreteQuestion question={item.question} answer={item.answer} id={index} key={index+keyVal} />
                            ):
                        <p>There are no questions for this atom</p>
                    }
                </ul>
                <div className='w-full text-center'><button onClick={changeQuestions} className="w-1/8 disabled:brightness-90 bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit mx-auto rounded-md active:translate-x-px">Generate new example questions</button></div>
            </div>
        </div>
    )

    function changeQuestions() {
        setKeyVal(keyVal+3)
    }
}