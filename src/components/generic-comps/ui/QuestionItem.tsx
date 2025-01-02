import Expand from '../../../assets/svgs/Expand.svg'
import Retract from '../../../assets/svgs/Retract.svg'
import { toTeX } from '../../../lib/shortcuts';
import { Question } from '../../../lib/interfaces';
import { useState } from 'react';



function QuestionItem({ questionObject, index }: {questionObject: Question; index: number}) {
    const formattedQuestion = toTeX(questionObject.question) // (DONE) TODO: error handling inside toTeX and safety net
    const longQuestion = questionObject.question && (questionObject.question.length > 200)
    const [expanded, setExpanded] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    return (
    <div className='justify-between grid grid-cols-6 p-4 rounded-3xl bg-[#CBD0D2] lg:mx-16 mx-4 md:px-8 px-4'>
        <div className='pl-2 pr-8 flex flex-col gap-4 my-2 md:col-span-5 sm:col-span-4 col-span-3'>
            <div className='flex flex-row gap-2 justify-between'>
                <div className="flex flex-row gap-6">
                    <h1 className='text-2xl font-semibold'>Question {index}</h1>
                    <div className='rounded-lg my-auto text-lg py-[3px] px-4 font-bold bg-[#CDFFC9] invisible sm:visible'><p>Easy</p></div>
                </div>
                {longQuestion && 
                <div>
                    <button onClick={() => setExpanded(!expanded)}><img className='max-w-[24px]' src={expanded ? Retract : Expand} alt="" /></button>
                </div>
                }
            </div>
            <div className={`CHILDREN - this is where the TeX stuff goes overflow-x-auto overflow-y-clip min-h-[64px] duration-500 ${expanded ? "max-h-max" : "max-h-[64px]"} py-2 break-all`}>
            {formattedQuestion}
            </div>
        </div>
        <div className='border-l-2 border-gray-600 md:col-span-1 sm:col-span-2 col-span-3 px-4 flex flex-col gap-4'>
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
        </div>
    </div>
    )
}

export default QuestionItem