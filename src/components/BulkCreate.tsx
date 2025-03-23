import { useState } from "react";
import { BulkInputQuestion, PVClient, RVClient } from "../lib/interfaces"
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { PVParent } from "./generic-comps/CreateQuestion";
import { RVParent } from "./generic-comps/CreateQuestion";
import { handleGenerateBulkTemplate } from "../lib/api/llmApi";
import { handleFetchSampleBulk } from "../lib/api/questionSampleApi";
import { toTeX } from "../lib/shortcuts";

const sampleInputQuestion: BulkInputQuestion = {
    questionInput: "",
    solutionInput: "",
    template: {
        question: "",
        rvs: [{
            name: '', 
            lb: '', 
            hb: '',
            coefficient: false,
            dp: 0
        }],
        pvs: [{
            varName: '', 
            latex: ``,
            coefficient: false,
            dp: 0
        }],
        answer: ""
    },
    checked: null,
    sample: {
        question: "",
        answer: ""
    }
}

export default function BulkCreate() {
    const [inputQuestions, setInputQuestions] = useState<BulkInputQuestion[]>([sampleInputQuestion]);
    
    function handleQuestionUpdate(index: number, name: string, value: string | boolean) {
        const nextQuestions = inputQuestions.map((q, i) => {
            return (i === index) ? {...q, [name]: value} : q;
        })
        setInputQuestions(nextQuestions);
    }
    function handleQuestionUpdateTemplate(index: number, name: string, value: string | RVClient[] | PVClient[]) {
        const nextQuestions = inputQuestions.map((q, i) => {
            return (i === index) ? {...q, template: {...q.template, [name]: value}} : q;
        })
        setInputQuestions(nextQuestions);
    }
    function handleAddInputQuestion() {
        setInputQuestions(prevInputQuestions => [...prevInputQuestions, sampleInputQuestion]);
    }
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');
    async function onGenerateTemplates() {
        setIsGenerating(true);
        const items = inputQuestions.map(iq => {
            if (!iq.questionInput.trim()) {
                setMessage('All questions must have content');
                setIsGenerating(false);
                return;
            }
            return [iq.questionInput, iq.solutionInput];
        }).filter((item): item is string[] => Boolean(item));

        if (items.length < inputQuestions.length) {
            return;
        }

        const response = await handleGenerateBulkTemplate(items);
        if(!response.success) {
            setMessage(response.message || 'Failed to generate templates')
        } else {
            setInputQuestions(oldInputQuestions => oldInputQuestions.map((iq, i) => {
                return {...iq, template: response.templates[i]}
            }))
        }
        setIsGenerating(false);
    }
    async function onFetchSamples() {
        const templates = inputQuestions.map(iq => {
            return {
                question: iq.template.question,
                answer: iq.template.answer,
                rvs: iq.template.rvs,
                pvs: iq.template.pvs
            }
        })
        const response = await handleFetchSampleBulk(templates);
        if(!response.success || !response.samples) {
            setMessage('Failed to fetch samples')
        } else {
            setInputQuestions(oldInputQuestions => oldInputQuestions.map((iq, i) => {
                return {...iq, sample: { question: response.samples[i].question, answer: response.samples[i].answer }}
            }))
        }
    }
    return (
        <div className="flex flex-col gap-8 mx-4 lg:mx-16 md:mx-12 my-8">
            <div className="TITLE py-4">
                <h1 className="font-semibold text-6xl">idk what to call this, create in bulk??</h1>
            </div>
            <div className="ACTIONBAR RESERVED flex flex-row gap-12 items-center">
                <div>
                <button 
                    onClick={onGenerateTemplates} 
                    disabled={isGenerating}
                    className={`py-2 px-4 outline outline-2 outline-darkgray font-medium rounded-lg shadow-md duration-300 ${
                        isGenerating 
                        ? 'bg-gray-200 cursor-not-allowed opacity-70' 
                        : 'bg-white text-darkgray hover:scale-105'
                    }`}
                >
                    {isGenerating ? 'Thinking...' : 'Generate'}
                </button>
                </div>
                <p>{message}</p>
                <div>
                <button onClick={onFetchSamples} className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium">
                    Preview / Back
                </button>
                </div>
                <div>
                    Regenerate the X'd ones (button)
                </div>
                <div>
                    Upload from document (button)
                </div>
            </div>
            <div className="QUESTIONS flex flex-col gap-8">
                {/* <InputQuestion 
                    inputQuestionObj={sampleInputQuestion} 
                    index={0}
                    key={0} 
                    onUpdate={handleQuestionUpdate} 
                /> */}
                {inputQuestions.map((q, i) => {
                    return <InputQuestion 
                    inputQuestionObj={q} 
                    index={i}
                    key={i} 
                    onUpdate={handleQuestionUpdate} 
                    onUpdateTemplate={handleQuestionUpdateTemplate}
                    /> 
                })}
            </div>
            <div className="ADD BUTTON mx-auto my-4">
                <button className="bg-darkgray text-white px-8 py-4 text-lg rounded-full font-medium" onClick={handleAddInputQuestion}>
                Add question
                </button>
            </div>
            <div className="BOTTOM BUTTONS flex flex-row justify-end mx-16 mb-12 gap-8 items-center">
            <button className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium">
                Upload
            </button>
            <p>Upload approved ones</p>
            </div>
        </div>
    )
}

function InputQuestion({ 
    inputQuestionObj, 
    onUpdate, 
    onUpdateTemplate,
    index }: { 
    inputQuestionObj: BulkInputQuestion, 
    onUpdate: (i: number, name: string, value: string | boolean) => void, 
    onUpdateTemplate: (i: number, name: string, value: string | RVClient[] | PVClient[]) => void,
    index: number }) {

    function setRVs(rvs: RVClient[]) {
        onUpdateTemplate(index, 'rvs', rvs);
    }
    function setPVs(pvs: PVClient[]) {
        onUpdateTemplate(index, 'pvs', pvs);
    }
    function setRegular(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onUpdate(index, e.target.name, e.target.value);
    }
    const [tab, setTab] = useState<'input' | 'preview' | 'template'>('input');
    const formattedSampleQuestion = toTeX(inputQuestionObj.sample.question);
    const formattedSampleAnswer = toTeX(inputQuestionObj.sample.answer);
    return (
        <div className="bg-lightgray flex flex-col gap-0 rounded-xl shadow-lg">
            <div className="bg-lightgray rounded-xl px-8 py-6 flex flex-col gap-8 shadow-xl">
            <div className="MENU BAR flex flex-row gap-4 justify-between">
                {/** Check & cross, show preview, regenerate */}
                <div className="TABS: Input/Preview/Template flex flex-row gap-4">
                <div className="flex bg-darkgray rounded-2xl p-1 gap-2">
                    <button 
                        className={`px-4 py-2 rounded-xl transition-all duration-150 font-medium ${tab === 'input' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTab('input');
                        }}
                    >Input</button>
                    <button 
                        className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${tab === 'preview' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTab('preview');
                        }}
                    >Preview</button>
                    <button 
                        className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${tab === 'template' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTab('template');
                        }}
                    >Template</button>
                    
                    
                </div>
                </div>
                <div className="flex flex-row gap-8">
                    <button className="" onClick={(e) => e.stopPropagation()}>
                        <CheckIcon height={32} />
                    </button>
                    <button className="" onClick={(e) => e.stopPropagation()}>
                        <XMarkIcon height={32} />
                    </button>
                </div>
            </div>
            {tab === 'input' && 
            <div className="grid grid-cols-2 gap-8 px-8" >
            <div className="QUESTION flex flex-col gap-2">
                <h1 className="font-medium text-xl">Question</h1>
                <textarea 
                    className="w-full rounded-lg p-2 outline-mywhite" 
                    name="questionInput" 
                    value={inputQuestionObj.questionInput} 
                    onChange={setRegular}
                />
            </div>
            <div className="SOLUTION flex flex-col gap-2">
                <h1 className="font-medium text-xl">Solution</h1>
                <textarea 
                className="w-full rounded-lg p-2 outline-mywhite" 
                name="solutionInput" 
                value={inputQuestionObj.solutionInput} 
                onChange={setRegular} 
                />
                </div>
            </div>
            }
            {tab === 'preview' && 
            <div className="px-8 gap-4">
            <h1 className="text-2xl font-medium">Sample question</h1>
            <div className={`CHILDREN h-fit overflow-x-auto overflow-y-clip duration-500 py-3 whitespace-pre-line`}>
                {formattedSampleQuestion}
            </div>
            <div className='h-px bg-midgray mb-2' />
            <h1 className="text-lg font-medium">Sample answer</h1>
            <div className={`CHILDREN h-fit overflow-x-auto overflow-y-clip duration-500 py-3 whitespace-pre-line`}>
                {formattedSampleAnswer}
                </div>
            </div>
            }
            {tab === 'template' && 
            <div className={`overflow-hidden duration-150 ease-in-out px-8`}>
            <div className="VARIABLES flex flex-col md:grid grid-cols-3 gap-8">
                <RVParent variables={inputQuestionObj.template.rvs} setVariables={setRVs}/>
                <div className="PVS flex flex-col col-span-2">
                    <h2 className="text-xl font-medium py-2">Processed Variables</h2>
                    <PVParent variables={inputQuestionObj.template.pvs} setVariables={setPVs}/>
                </div>
            </div>
            <div className="QNA grid grid-cols-2 gap-8 my-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Question template</h2>
                    <textarea 
                    className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                    placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                    value={inputQuestionObj.template.question} 
                    onChange={e => onUpdateTemplate(index, 'question', e.target.value)}/>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Answer template</h2>
                    <textarea 
                    className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                    placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                    value={inputQuestionObj.template.answer} 
                    onChange={e => onUpdateTemplate(index, 'answer', e.target.value)}/>
                </div>
                
            </div>
            </div>
            }
            </div>            
        </div>
    )
}