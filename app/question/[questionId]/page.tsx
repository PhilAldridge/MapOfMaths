import Banner from "@/app/components/banner";
import QuestionExample from "@/app/components/questionExamples";


function QuestionPage({params}: {params: {questionId:string}}) {
    const id = params.questionId;
    return (
        <div className="p-4 flex flex-col gap-8">
        <Banner />
        <QuestionExample questionId={id} />
        </div>
    )
}

export default QuestionPage