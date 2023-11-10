import { createConcreteQuestion } from "../lib/questionParse"
import { useState } from "react";

function ConcreteQuestion({question, answer, id}:{question:string, answer:string, id:number}) {
    const [input, setInput] = useState("");
    const [correct,setCorrect]= useState(false);
    const [questionMade,setQuestionMade] = useState<ConcreteQuestion>();

    if(!questionMade) {
        setQuestionMade(createConcreteQuestion(question,answer));
        return (<></>);
    }
    
  return (<div className="m-3 flex gap-10 justify-start">
    <div className="w-1/2">Question: {questionMade.question}</div>
    <div className="w-1/4"><label htmlFor={'answer'+id}>Answer: </label>
    <input className="text-black" type="text" name={'answer'+id} id={'answer'+id} onChange={(e)=>{setInput(e.target.value)}} value={input}></input>
    </div>
    <button onClick={checkAnswer} disabled={correct} className="w-1/8 disabled:brightness-90 bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit mx-auto rounded-md active:translate-x-px">Check</button>
    {correct? <div className="w-1/12">Congratulations</div>:<div className="w-1/12"></div>}
    
  </div>)


    function checkAnswer() {
        if(input===questionMade?.answer) {
            setCorrect(true);
        }
    }
}

export default ConcreteQuestion