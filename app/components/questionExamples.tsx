'use client'
import Link from 'next/link'
import{useState, useEffect} from 'react'
import ConcreteQuestion from './concreteQuestion'

type DataExpected = {
    m: {
        properties: Sanitized
    },
    n: {
        properties: {
            id:string;
            name:string
        }
    }
}

type Sanitized = {
    question: string;
    answer: string;
    id?:string;
    atomId?:string;
    atomName?:string
}

type QuestionVariable = {
    name?: string;
    fullString: string;
    value: number;
}

export default function QuestionExample({questionId}: {questionId:string}) {
    const [question, setQuestion] = useState<Sanitized>();
    const [keyVal,setKeyVal] = useState(0);

    useEffect(()=>{
        const getQuestions =async () => {
            const result = await fetch('/api/questions/id/'+questionId);
            const data: DataExpected[] = await result.json()
            
            let sanitizedData = data[0].m.properties
            sanitizedData.atomId = data[0].n.properties.id;
            sanitizedData.atomName = data[0].n.properties.name;
            //createConcreteQuestion(sanitizedData);
            setQuestion(sanitizedData)
        }

        getQuestions();
    },[questionId])

    return (
        <div className="p-2 rounded-xl border-2 border-slate-200 bg-slate-800">
            {question?.question? 
                (<>
                    <h1 className="text-slate-200 text-2xl mb-2">Question: <span className=' italic text-pink-100'>{question.question}</span></h1>
                    {question.atomName && <h2 className='text-xl mb-2 text-slate-300'>Checks: <Link className=' text-pink-300 hover:text-pink-200' href={'/learningAtom/'+question.atomId}>{question.atomName}</Link></h2>}
                    <h2 className='text-lg mb-2'>Try it:</h2>
                   
                    {
                         <div>
                            <ConcreteQuestion question={question.question} answer={question.answer} id={1} key={'concrete' + keyVal} />
                            <ConcreteQuestion question={question.question} answer={question.answer} id={2} key={'concrete' + keyVal+1} />
                            <ConcreteQuestion question={question.question} answer={question.answer} id={3} key={'concrete' + keyVal +2} />
                         </div>
                    }
                    <div className='w-full text-center'><button onClick={changeQuestions} className="w-1/8 disabled:brightness-90 bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit mx-auto rounded-md active:translate-x-px">Generate new example questions</button></div>
                </>)
                :
                (<h1 className=" text-2xl mb-2">Loading...</h1>)
            }
        </div>
    )
    function changeQuestions() {
        setKeyVal(keyVal+3)
    }

    async function handleDelete(id:string) {
        await fetch('/api',{
            method: "DELETE",
            body: JSON.stringify({
                action: "nodeexternalid",
                id: id
            })
        })
    }

    function createConcreteQuestion(question: Sanitized) {
        var regex = /{([^}]+)}/g;
        let match;
        let results: QuestionVariable[] = [];
        while (match = regex.exec(question.question as string)) {
            if(match[1].includes('=')) {
                results.push({
                    name: match[1].split('=')[0],
                    fullString: match[1],
                    value:0
                });
            } else{
                results.push({
                    fullString: match[1],
                    value:0
                })
            }
            
        }
        
    }

}