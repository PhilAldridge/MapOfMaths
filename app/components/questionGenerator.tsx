function QuestionGenerator({atomId}: {atomId:string}) {
  return (
    <div className="m-6">
        <h1 className=" text-2xl mt-7 mb-2">Question Generator</h1>
        <form className="w-full flex flex-col text-center">
            <textarea id="question" name="question" rows={4} placeholder="Type your question here" className="w-full m-2 rounded-md" />
            <input type="text" name="answer" id="answer" placeholder="Type your answer here" className="w-full m-2 rounded-md"/>
            <button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:brightness-110 active:brightness-90 p-2 w-fit mx-auto rounded-md active:translate-x-px">Add Question</button>
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
    </div>
  )
}

export default QuestionGenerator