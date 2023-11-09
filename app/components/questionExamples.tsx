'use client'
import Link from 'next/link'
import{useState, useEffect} from 'react'

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
                    <h1 className=" text-2xl mb-2">{question.question}</h1>
                    {question.atomName && <h2 className='text-xl mb-2 text-slate-300'>Checks: <Link className=' text-pink-300 hover:text-pink-200' href={'/learningAtom/'+question.atomId}>{question.atomName}</Link></h2>}
                    <h2 className='text-lg mb-2'>Try it:</h2>
                    <div>

                    </div>
                </>)
                :
                (<h1 className=" text-2xl mb-2">Loading...</h1>)
            }
        </div>
    )
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

    function evaluateString(givenString:string): number {
        givenString = givenString.replace(" ", "");

        // array []
        if(givenString[0]==='[') {
            givenString = givenString.substring(1,givenString.length-1);
            //regex commas not contained in brackets
            const possibleValues = givenString.split(/,\s*(?![^()]*\))/g)
            return evaluateString(possibleValues[Math.floor(Math.random()*possibleValues.length)])
        }
        
        // number (regex number including decimals and negatives)
        const numberPattern = /^-?\d+(\.\d+)?$/;
        if(numberPattern.test(givenString)) return Number(givenString);

        //randBetween NOT CORRECT NEEDS TO GET OUT OF BRACKET SAFELY
        if(givenString.startsWith('randBetween(')) {
            givenString = givenString.substring(12,givenString.length-1)
            //regex commas not contained in brackets
            const range = givenString.split(/,\s*(?![^()]*\))/g);
            return getRandomInteger(evaluateString(range[0]), evaluateString(range[1]))
        }

        //sin, cos, tan NOT CORRECT NEEDS TO GET OUT OF BRACKET SAFELY
        switch(givenString.slice(0,4)) {
            case 'sin(':
                return Math.sin(evaluateString(givenString.substring(4,givenString.length-1))*Math.PI/180)
            case 'cos(':
                return Math.cos(evaluateString(givenString.substring(4,givenString.length-1))*Math.PI/180)
            case 'tan(':
                return Math.tan(evaluateString(givenString.substring(4,givenString.length-1))*Math.PI/180)
            default:
                break;
        }

        //bracket
        if(givenString.includes('(')) {
            const textAndBrackets = findSubstringInBracket(givenString)
            const updatedString = givenString.replace(textAndBrackets, evaluateString(textAndBrackets.substring(1,givenString.length-1)).toString())
            return evaluateString(updatedString)
        }

        //operations
        //power  NOT CORRECT WHAT IF BASE AND EXPONENT CONTAIN FUNCTIONS
        if(givenString.includes('^')){
            const splitString = givenString.split('^')
            const superSplit = splitString[0].split(/[+\-*/^]/);
            const base = superSplit[superSplit.length-1]
            const exponent = splitString[1].split(/[+\-*/^]/)[0];
            const fullPowerString = base+'^'+exponent;
            const updatedString = givenString.replace(fullPowerString, Math.pow(Number(base), Number(exponent)).toString())
            return evaluateString(updatedString);
        }

        //multiplydivide
        if(givenString.includes('*') || givenString.includes('/')) {

        }
        
        //variables????

        //STRINGS????

        return 0
    }

    function getRandomInteger(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    function findSubstringInBracket(fullString:string):string {
        const startIndex = fullString.indexOf('(');
        let endIndex = fullString.length-1;
        let bracketDepth = 1;
        for(let i = startIndex+1; i<fullString.length; i++){
            if(bracketDepth === 0) {
                endIndex = i;
                break;
            }
            switch(fullString[i]){
                case '(':
                    bracketDepth++
                    break;
                case ')':
                    bracketDepth--;
                    break;
                default:
                    break;
            }
        }
        return fullString.substring(startIndex,endIndex+1)
    }
}