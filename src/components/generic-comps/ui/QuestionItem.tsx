// import Expand from '../../../assets/svgs/Expand.svg'
// import Retract from '../../../assets/svgs/Retract.svg'
import { toTeX } from '../../../lib/shortcuts';
import { Question } from '../../../lib/interfaces';
import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';



function QuestionItem({ questionObject, index, categoryId }: {questionObject: Question; index: number, categoryId: string }) {
    const formattedQuestion = toTeX(questionObject.question) // (DONE) TODO: error handling inside toTeX and safety net
    const formattedAnswer = toTeX(questionObject.answer);
    // const longQuestion = questionObject.question && (questionObject.question.length > 200)
    // const [expanded, setExpanded] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    return (
    <div className='p-6 my-2 rounded-3xl bg-[#CBD0D2] lg:mx-24 mx-4 md:px-8 px-4 drop-shadow flex flex-col gap-2'>
        <div className='flex flex-row gap-2 justify-between'>
            <div className="flex flex-row gap-6 items-center">
                <h1 className='text-2xl font-semibold'>Question {index}</h1>
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
        {/* <div className='border-l-2 border-gray-600 md:col-span-1 sm:col-span-2 col-span-3 px-4 flex flex-col gap-4'>
            <button onClick={() => setShowAnswer(!showAnswer)}>
                <div className="px-4 py-1 m-2 bg-[#444341] rounded-xl text-center">
                    <h1 className="font-semibold px-auto text-[#ECEAE1] lg:text-lg md:text-md text-sm tracking-wide overflow-clip">{showAnswer ? 'hide' : 'answer'}</h1>
                </div>
            </button>
            {showAnswer && 
            <div>
                <h1 className='text-lg'>{questionObject.answer}</h1>
            </div>
            }
        </div> */}
    </div>
    )
}

export default QuestionItem