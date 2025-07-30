import { Link, useParams, useNavigate } from "react-router-dom";
import { Category, GeneratedQuestionType } from "../../lib/interfaces";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { toTeX } from "../../lib/shortcuts";
import { useEffect, useState } from "react";
import { fetchCategoryDetails } from "../../lib/api/categoryDetailsApi";
import { fetchNextSR, fetchStartSR } from "../../lib/api/spacedRepetitionApi";
import { useAuth } from "../../AuthContext";
export default function RepetitionPage() {
    const categoryId = useParams().categoryId || '';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [category, setCategory] = useState<Category>({
        _id: '',
        title: '',
        description: '',
        imageLink: '',
        tags: [],
        author: '',
        questions: [],
    });
    const [question, setQuestion] = useState<GeneratedQuestionType | null>(null);
    const [aptitude, setAptitude] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/account', { state: { message: 'Please sign in to access spaced repetition.' } });
            return;
        }

        setLoading(true);
        Promise.all([
            fetchCategoryDetails(categoryId),
            fetchStartSR(categoryId)
        ])
        .then(([categoryData, srData]) => {
            setCategory(categoryData);
            setQuestion(srData.question);
            setAptitude(srData.aptitude);
        })
        .catch(error => {
            console.error(error);
            // Handle specific error cases if needed
        })
        .finally(() => {
            setLoading(false);
        });
    }, [user, categoryId, navigate]);

    useEffect(() => {
        document.title = category?.title + ' - Orchard';
    }, [category.title])

    async function handleFeedbackClick(difficulty: number) {
        // console.log('clicked')
        if(!question?.id) {
            console.log('no question id')
            return
        }
        const newQuestion = await fetchNextSR(categoryId, question?.id, difficulty)
        if(!newQuestion) {
            console.log('new question is null')
        }
        console.log(newQuestion)
        setQuestion(newQuestion.question)
        setAptitude(newQuestion.aptitude)
    }

    if (!user) {
        return null; // Component will unmount due to navigation
    }

    if (loading) {
        return (
            <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col gap-4 grow items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col gap-4 grow">
            <div className="TITLE pt-12 pb-4 md:px-16 px-4">
                <div className="flex flex-col gap-2">
                    <Link 
                        to={`/library/${categoryId}`}
                        className="text-[#444341] hover:text-[#444341]/80 hover:underline duration-300 text-lg font-medium"
                    >
                        ← Go back
                    </Link>
                    <h1 className="font-semibold md:text-5xl text-4xl text-[#444341]">{category.title}</h1>
                </div>
            </div>
            
            <RepetitionQuestionItem 
            questionObject={question}
            categoryId={categoryId}
            />
            <div className="ACTION BAR mx-12 items-center justify-center md:flex grid-cols-2 grid md:gap-16 gap-6">
                <button 
                className="px-8 py-2 text-lg rounded-xl font-medium bg-green-300 outline outline-2 outline-green-200 hover:outline-green-400 shadow-lg hover:scale-105 duration-300 inline"
                onClick={() => handleFeedbackClick(1)}
                >Easy</button>
                <button 
                className="px-8 py-2 text-lg rounded-xl font-medium bg-yellow-300 outline outline-2 outline-yellow-200 hover:outline-yellow-400 shadow-lg hover:scale-105 duration-300 inline"
                onClick={() => handleFeedbackClick(2)}
                >Good</button>
                <button 
                className="px-8 py-2 text-lg rounded-xl font-medium bg-orange-300 outline outline-2 outline-orange-200 hover:outline-orange-400 shadow-lg hover:scale-105 duration-300 inline"
                onClick={() => handleFeedbackClick(3)}
                >Hard</button>
                <button 
                className="px-8 py-2 text-lg rounded-xl font-medium bg-red-300 outline outline-2 outline-red-200 hover:outline-red-400 shadow-lg hover:scale-105 duration-300 inline"
                onClick={() => handleFeedbackClick(4)}
                >Very hard</button>
            </div>
            {aptitude ? <div className="px-6 py-3 my-2 mx-auto bg-darkgray text-white inline font-medium text-lg rounded-xl shadow-lg">
                {aptitude}% proficient
            </div> : <div />}
        </div>
    )
}

function RepetitionQuestionItem({ questionObject, categoryId }: {questionObject: GeneratedQuestionType | null, categoryId: string }) {
    const [showAnswer, setShowAnswer] = useState(false);

    if(!questionObject) {
        return (
            <div className="p-6 my-2 rounded-3xl bg-[#CBD0D2] lg:mx-24 mx-4 md:px-8 px-4 drop-shadow flex flex-col gap-2 h-[200px]">

            </div>
        )
    }
    const formattedQuestion = toTeX(questionObject.question) // (DONE) TODO: error handling inside toTeX and safety net
    const formattedAnswer = toTeX(questionObject.answer);
    // const longQuestion = questionObject.question && (questionObject.question.length > 200)
    // const [expanded, setExpanded] = useState(false);

    return (
    <div className='p-6 my-2 rounded-3xl bg-[#CBD0D2] lg:mx-24 mx-4 md:px-8 px-6 drop-shadow flex flex-col gap-2'>
        <div className='flex flex-row gap-2 justify-between'>
            <div className="flex flex-row gap-6 items-center">
                <h1 className='text-2xl font-semibold'>Question</h1>
                {/* <div className='rounded-lg drop-shadow my-auto text-lg py-[3px] px-4 font-bold bg-[#CDFFC9] invisible sm:visible'><p>Easy</p></div> */}
            </div>
            <Link to={`/edit/${categoryId}/${questionObject.id}`}>
                <PencilSquareIcon className='h-8' />
            </Link>
            {/* {longQuestion && 
            <div>
                <button onClick={() => setExpanded(!expanded)}><img className='max-w-[24px]' src={expanded ? Retract : Expand} alt="" /></button>
            </div>
            } */}
        </div>
        <div className={`CHILDREN h-fit overflow-x-auto overflow-y-clip duration-500 py-3 whitespace-pre-line`}>
        {formattedQuestion}
        </div>

        <div className={`ANSWER flex flex-col gap-2 mb-2 ${showAnswer ? 'h-auto' : 'h-0'}  duration-300 overflow-hidden`}>
            <div className='h-px bg-midgray mb-2' />
            <h1 className='text-lg font-semibold'>Answer</h1>
            <div className='mb-2 break-all whitespace-pre-line'>
                {formattedAnswer}
            </div>
        </div>
        <div className='flex'>
        <button className="w-[100px] py-1 bg-[#444341] rounded-xl text-center" onClick={() => setShowAnswer(!showAnswer)}>
            <h1 className="font-normal px-auto text-[#ECEAE1] text-sm tracking-wide overflow-clip">{showAnswer ? 'hide' : 'answer'}</h1>
        </button>
        </div>
    </div>
    )
}