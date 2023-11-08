function QuestionGenerator({atomId, updateList}: {atomId:string, updateList: ()=>void}) {
  return (
    <div className="p-2 rounded-xl border-2 border-slate-200 bg-slate-800">
        <h1 className=" text-2xl mb-2">Question Generator</h1>
        <form onSubmit={(e)=>{handleClick(e)}} className="w-full flex flex-col text-center">
            <textarea required id="question" name="question" rows={4} placeholder="Type your question here" className="w-full m-2 rounded-md invalid:bg-red-100 valid:bg-green-100 text-black" />
            <input required type="text" name="answer" id="answer" placeholder="Type your answer here" className="w-full m-2 rounded-md invalid:bg-red-100 valid:bg-green-100 text-black"/>
            <input id="submit" type="submit" className="disabled:brightness-90 bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit mx-auto rounded-md active:translate-x-px" value="Add question" />
        </form>
        <h2 className="text-xl">Variables:</h2>
        <ul className="list-disc list-inside">
            <li>Variables are defined inside curly brackets</li>
            <li>They can be defined using an array, e.g. {"{x=[1,2,3,4,5]}"}</li>
            <li>Or with a function, e.g. {"{x=randBetween(1,5)} or {y=(x+z)/5}"}</li>
        </ul>
        <h3 className="text-xl">Functions:</h3>
        <ul className="list-disc list-inside">
            <li>Standard Operations: +, -, *, /, ^</li>
            <li>Random integer between a and b inclusive: randBetween(a,b)</li>
            <li>Trig functions: sin(a)</li>
        </ul>
        <h3 className="text-xl">Answers:</h3>
        <ul className="list-disc list-inside">
            <li>If an answer does not need to be exact, use: {"{range(from,to}"}</li>
        </ul>
    </div>
  )

  async function handleClick(event:React.FormEvent<HTMLFormElement> ) {
        event.preventDefault();
        const form = event.currentTarget;
        const submitButton: HTMLInputElement = document.getElementById("submit") as HTMLInputElement;
        submitButton.disabled = true;
        submitButton.value = "...Adding";
        let data = Object.fromEntries(new FormData(form))
        data.atomId=atomId
        await fetch('/api/questions/'+atomId, {
            method: "POST",
            body: JSON.stringify(data)
        })
        submitButton.disabled = false;
        submitButton.value = "Add question";
        updateList()
        form.reset();
    }
}




export default QuestionGenerator