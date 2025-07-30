import { useState, Fragment, useEffect } from "react";
import { BulkInputQuestion, PVClient, RVClient, Category } from "../lib/interfaces"
import { TrashIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { PVParent } from "./generic-comps/CreateQuestion";
import { RVParent } from "./generic-comps/CreateQuestion";
import { extractQuestions, handleGenerateBulkTemplate } from "../lib/api/llmApi";
import { handleFetchSampleBulk } from "../lib/api/questionSampleApi";
import { fetchCategoryDetails } from "../lib/api/categoryDetailsApi";
import { toTeX } from "../lib/shortcuts";
import { getOCRImage, getOCRPDF } from "../lib/api/ocrApi";
import Latex from 'react-latex-next';
import TextareaAutosize from 'react-textarea-autosize';
import { Transition } from '@headlessui/react';
import Check from '../assets/svgs/Check.svg';
import Cross from '../assets/svgs/Cross.svg';
import HighlightCheck from '../assets/svgs/HighlightCheck.svg';
import HighlightCross from '../assets/svgs/HighlightCross.svg';
import { handlePostQuestions } from "../lib/api/createApi";
import { Link, useParams } from "react-router-dom";
import ComboSelectCategory from "./generic-comps/ui/ComboSelectCategory";

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
    },
    tab: 'input',
}

export default function BulkCreate() {
    const categoryId = useParams().categoryId || '-1';
    const [selectedId, setSelectedId] = useState(categoryId);
    const [inputQuestions, setInputQuestions] = useState<BulkInputQuestion[]>([sampleInputQuestion]);
    const [bulkState, setBulkState] = useState<'preview' | 'input' | null>(null);
    const [shouldFetchSamples, setShouldFetchSamples] = useState(false);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        setInputQuestions(prevInputQuestions => prevInputQuestions.map(iq => ({...iq, tab: bulkState})));
    }, [bulkState]);

    useEffect(() => {
        if (shouldFetchSamples) {
            onFetchSamples();
            setShouldFetchSamples(false);
        }
    }, [shouldFetchSamples]);

    useEffect(() => {
        if (categoryId && categoryId !== '-1') {
            fetchCategoryDetails(categoryId)
                .then(data => setCategory(data))
                .catch(error => console.error('Error fetching category details:', error));
        }
    }, [categoryId]);

    function handleQuestionUpdate(index: number, name: string, value: string | boolean | null) {
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
    const [activeGenerateButton, setActiveGenerateButton] = useState<'all' | 'incorrect'>('all');
    async function onGenerateTemplates() {
        setMessage('');
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
                return {...iq, 
                    template: {
                        question: response.templates[i].question || '',
                        answer: response.templates[i].answer || '',
                        rvs: response.templates[i].rvs || [],
                        pvs: response.templates[i].pvs || []
                    },
                    checked: true}
            }))
            setBulkState('preview')
            setShouldFetchSamples(true);
            setActiveGenerateButton('incorrect');
        }
        setIsGenerating(false);
    }
    async function onFetchSamples() {
        setMessage('');
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
            setBulkState('preview')
        }
    }
    const [ocrData, setOcrData] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [showOcrPopup, setShowOcrPopup] = useState(false);
    const [ocrTab, setOcrTab] = useState<'content' | 'review' | 'preview'>('review');
    const [isDetecting, setIsDetecting] = useState(false);
    const [previewParse, setPreviewParse] = useState<string[]>([]);
    const [showUploadDropdown, setShowUploadDropdown] = useState(false);

    async function handleConfirm() {
        setMessage('');
        try {
            const newQuestions = previewParse.map(text => ({
                questionInput: text,
                solutionInput: '',
                template: {
                    question: '',
                    answer: '',
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
                    }]
                },
                sample: {
                    question: '',
                    answer: ''
                },
                tab: 'input' as const,
                checked: null
            }));
            
            setInputQuestions(oldQuestions => {
                // If there's only one question and it's the default empty one, replace it
                if (oldQuestions.length === 1 && 
                    oldQuestions[0].questionInput === '' && 
                    oldQuestions[0].solutionInput === '' && 
                    oldQuestions[0].template.question === '') {
                    return newQuestions;
                }
                // Otherwise append the new questions
                return [...oldQuestions, ...newQuestions];
            });
            setShowOcrPopup(false);
            setPreviewParse([]);
            setOcrData('');
            setOcrTab('review');
        } catch (err) {
            console.error('Error confirming:', err);
            setMessage('Failed to add questions');
        } finally {
            setIsDetecting(false);
        }
    }
    async function handleDetect() {
        setMessage('');
        setIsDetecting(true);
        try {
            const result = await extractQuestions(ocrData);
            if(!result.success) {
                setMessage(result.message || 'Failed to extract questions')
            } else {
                setPreviewParse(result.questions);
            }
            
        } catch (err) {
            console.error('Error detecting:', err);
        } finally {
            setIsDetecting(false);
        }
    }

    async function onUploadFile() {
        setMessage('');
        setIsUploading(true);
        const cleanup = () => setIsUploading(false);
        
        const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.docx,image/*';
            input.onabort = cleanup;
            input.oncancel = cleanup;
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    let data;
                    if (file.type === 'application/pdf') {
                        data = await getOCRPDF(file);
                    } else if (file.type.startsWith('image/')) {
                        data = await getOCRImage(file);
                    } else {
                        throw new Error('Unsupported file type');
                    }
                    if(data.success) {
                        setOcrData(data.text);
                        setShowOcrPopup(true);
                    } else {
                        setMessage(data.message || 'Failed to process file');
                    }
                } catch (err) {
                    console.error('Error uploading file:', err);
                }
                setIsUploading(false);
            };
            input.click();
    }

    function openOcrMenu() {
        setShowOcrPopup(true);
    }

    function handleSwitchTab(tab: 'input' | 'preview', index: number) {
        setInputQuestions(prevInputQuestions => prevInputQuestions.map((iq, i) => {
            return (i === index) ? {...iq, tab: tab} : {...iq};
        }));
    }   
    function handleDeleteQuestion(index: number) {
        setInputQuestions(prevInputQuestions => prevInputQuestions.filter((_, i) => i !== index));
    }
    async function onRegenerateIncorrect() {
        setMessage('');
        setIsGenerating(true);
        
        // Get indices and questions that are marked as incorrect
        const incorrectQuestions = inputQuestions
            .map((iq, index) => ({ iq, index }))
            .filter(({ iq }) => iq.checked === false);

        if (incorrectQuestions.length === 0) {
            setMessage('No incorrect questions to regenerate');
            setIsGenerating(false);
            return;
        }

        const items = incorrectQuestions.map(({ iq }) => {
            if (!iq.questionInput.trim()) {
                setMessage('All questions must have content');
                setIsGenerating(false);
                return;
            }
            return [iq.questionInput, iq.solutionInput];
        }).filter((item): item is string[] => Boolean(item));

        if (items.length < incorrectQuestions.length) {
            return;
        }

        const response = await handleGenerateBulkTemplate(items);
        if(!response.success) {
            setMessage(response.message || 'Failed to generate templates')
        } else {
            // Update only the incorrect questions at their original positions
            setInputQuestions(oldInputQuestions => {
                const newQuestions = [...oldInputQuestions];
                incorrectQuestions.forEach(({ index }, i) => {
                    newQuestions[index] = {
                        ...newQuestions[index],
                        template: {
                            question: response.templates[i].question || '',
                            answer: response.templates[i].answer || '',
                            rvs: response.templates[i].rvs || [],
                            pvs: response.templates[i].pvs || []
                        }
                    };
                });
                return newQuestions;
            });
            setBulkState('preview');
            onFetchSamples();
        }
        setIsGenerating(false);
    }
    async function onSubmit(approvedOnly: boolean) {
        setMessage('');
        if(selectedId === '-1') {
            setMessage('Select an ID')
            return
        }
        const approvedQuestions = inputQuestions.filter(iq => approvedOnly ? iq.checked === true : true).map(iq => iq.template);        
        
        if (approvedQuestions.length === 0) {
            setMessage('No approved questions to upload');
            return;
        }

        // Check each approved question for validity
        for (const question of approvedQuestions) {
            // Check for duplicate PV names
            const seenPVNames = new Set();
            for (let i = 0; i < question.pvs.length; i++) {
                if (seenPVNames.has(question.pvs[i].varName)) {
                    setMessage('You have some duplicate variables');
                    return;
                }
                seenPVNames.add(question.pvs[i].varName);
            }

            // Check for duplicate RV names
            const seenRVNames = new Set();
            for (let i = 0; i < question.rvs.length; i++) {
                if (seenRVNames.has(question.rvs[i].name)) {
                    setMessage('You have some duplicate variables');
                    return;
                }
                seenRVNames.add(question.rvs[i].name);
            }

            // Check for empty fields
            const somePVsEmpty = question.pvs.some(pv => pv.varName === '' || pv.latex === '');
                const someRVsEmpty = question.rvs.some(rv => rv.name === '' || rv.lb === '' || rv.hb === '');
            if (somePVsEmpty || someRVsEmpty || !question.question.trim()) {
                setMessage('Some of your fields are empty. Fill them in!');
                return;
            }
        }

        // TODO: Implement actual upload functionality
        setMessage('Uploading approved questions...');
        const result = await handlePostQuestions(approvedQuestions, selectedId);
        if(result.success) {
            setMessage('Uploaded approved questions successfully');
        } else {
            setMessage(result.message || 'Failed to upload approved questions');
        }
    }
    return (
        <div className="flex flex-col gap-4 mx-4 lg:mx-16 md:mx-12 my-8">
            {showOcrPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white flex flex-col gap-4 rounded-xl py-8 px-12 max-w-[1120px] w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Imported data</h2>
                            <button 
                                onClick={() => setShowOcrPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon height={24} />
                            </button>
                        </div>
                        <div className="flex bg-darkgray rounded-2xl p-1 gap-2">
                            <button 
                                className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${ocrTab === 'review' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                                onClick={() => setOcrTab('review')}
                            >Import</button>
                            <button 
                                className={`px-4 py-2 rounded-xl transition-all duration-150 font-medium ${ocrTab === 'content' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                                onClick={() => setOcrTab('content')}
                            >Content</button>
                            <button 
                                className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${ocrTab === 'preview' ? 'bg-gray-100 text-darkgray' : 'hover:bg-gray-100 hover:opacity-80 hover:text-darkgray text-white'}`}
                                onClick={() => setOcrTab('preview')}
                            >Preview</button>
                        </div>
                        {ocrTab === 'content' ? 
                        (
                            <div className="whitespace-pre-wrap font-inter text-sm break-words overflow-wrap py-4 px-4 rounded-xl bg-gray-100 border-gray-300 border">
                                {ocrData ? <Latex children={ocrData} /> : <p className="">Import something first!</p>}
                            </div>
                        ) : ocrTab === 'review' ? (
                            <>
                                <button 
                                    onClick={onUploadFile} 
                                    disabled={isUploading}
                                    className={`w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-darkgray transition-colors ${
                                        isUploading 
                                        ? 'bg-gray-100 cursor-not-allowed' 
                                        : 'bg-white'
                                    }`}
                                >
                                    {isUploading ? 'Importing...' : 'Import PDF or image'}
                                </button>
                                <TextareaAutosize
                                    className="w-full p-4 font-mono text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkgray"
                                    value={ocrData}
                                    placeholder="Paste your questions document here..."
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOcrData(e.target.value)}
                                />
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {previewParse.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Click Detect questions!
                                    </div>
                                ) : (
                                    previewParse.map((text, index) => (
                                        <div className="flex gap-2 items-start">
                                            <TextareaAutosize
                                                key={index}
                                                className="w-full p-4 font-mono text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkgray"
                                                value={text}
                                                onChange={(e) => {
                                                    setPreviewParse(oldPreviewParse => oldPreviewParse.map((q, i) => i === index ? e.target.value : q));
                                                }}
                                            />
                                            <button
                                                onClick={() => setPreviewParse(oldPreviewParse => oldPreviewParse.filter((_, i) => i !== index))}
                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end items-center gap-4">
                            <p>{message}</p>
                            <button 
                                onClick={handleDetect}
                                disabled={isDetecting}
                                className={`py-2 px-4 outline outline-2 outline-darkgray font-medium rounded-lg shadow-md duration-300 ${
                                    isDetecting 
                                    ? 'bg-gray-200 cursor-not-allowed opacity-70' 
                                    : 'bg-white text-darkgray hover:scale-105'
                                }`}
                            >
                                {isDetecting ? 'Processing...' : 'Detect questions'}
                            </button>
                            <button 
                                onClick={handleConfirm}
                                disabled={previewParse.length === 0}
                                className={`py-2 px-4 outline outline-2 outline-darkgray font-medium rounded-lg shadow-md duration-300 ${
                                    previewParse.length === 0
                                    ? 'cursor-not-allowed opacity-70' 
                                    : 'bg-darkgray text-white hover:scale-105'
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="TITLE py-2 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Link 
                            to={categoryId && categoryId !== '-1' ? `/library/${categoryId}` : `/library`}
                            className="text-darkgray hover:text-darkgray/80 hover:underline duration-300 text-lg font-medium"
                        >
                            ← Go back
                        </Link>
                    </div>
                    <h1 className="font-semibold text-6xl">Bulk Create</h1>
                    {category && (
                        <p className="text-xl text-gray-600 font-medium">
                            for {category.title}
                        </p>
                    )}
                </div>
                <Link to={`/create/question/${selectedId}`} className="text-darkgray hover:text-darkgray/80 hover:underline duration-300">Create individual question</Link>
            </div>
            <div className="ACTIONBAR RESERVED flex flex-row items-center md:gap-8 gap-4">
                <div className="sm:block hidden"><ComboSelectCategory categoryId={selectedId} onChange={setSelectedId}/></div>
                <div className="relative" onMouseEnter={() => {
                            setShowGenerateDropdown(true);
                            setShowDropdown(false);
                        }}
                        onMouseLeave={() => {
                            setShowGenerateDropdown(false);
                        }}>
                    <button 
                        onClick={() => {
                            if (activeGenerateButton === 'all') {
                                onGenerateTemplates();
                            } else {
                                onRegenerateIncorrect();
                            }
                            setShowGenerateDropdown(false);
                        }}
                        className={`py-2 px-4 outline outline-2 outline-darkgray font-medium rounded-lg shadow-md duration-300 flex items-center gap-2 ${
                            isGenerating 
                            ? 'bg-gray-200 cursor-not-allowed opacity-70' 
                            : 'bg-white text-darkgray hover:scale-105'
                        }`}
                    >
                        {isGenerating ? 'Thinking...' : activeGenerateButton === 'all' ? 'Generate all' : 'Regenerate incorrect'}
                        <ChevronDownIcon height={16} className="fill-darkgray" />
                    </button>
                    <Transition
                        as={Fragment}
                        show={showGenerateDropdown}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-[70%]"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-[70%]"
                    >
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md outline outline-2 outline-darkgray p-1 z-10 min-w-[210px]">
                            <button
                                onClick={() => {
                                    onGenerateTemplates();
                                    setShowGenerateDropdown(false);
                                }}
                                disabled={isGenerating}
                                className={`w-full px-4 py-2 text-left text-darkgray font-medium transition-colors duration-200 
                                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                                    hover:bg-darkgray rounded-lg hover:text-white`}
                            >
                                Generate all
                            </button>
                            <button
                                onClick={() => {
                                    onRegenerateIncorrect();
                                    setShowGenerateDropdown(false);
                                }}
                                disabled={isGenerating}
                                className={`
                                    w-full px-4 py-2 text-left cursor-pointer font-medium text-darkgray transition-colors duration-200 
                                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                                    hover:bg-darkgray rounded-lg hover:text-white`}
                            >
                                Regenerate incorrect
                            </button>
                        </div>
                    </Transition>
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => {
                            setShowDropdown(!showDropdown);
                            setShowGenerateDropdown(false);
                        }}
                        className="rounded-xl bg-darkgray text-white px-4 py-2 font-medium flex items-center gap-2"
                    >
                        <button onClick={e => {
                            e.stopPropagation();
                            setBulkState(bulkState === 'preview' ? 'input' : 'preview');
                            setShowDropdown(false);
                            setShowGenerateDropdown(false);
                            if(bulkState === 'input') {
                                onFetchSamples();
                            }
                        }} className="md:text-md text-md hover:opacity-70 duration-150">
                            {bulkState === 'preview' ? 'Show Inputs' : 'Show Previews'}
                        </button>
                        <ChevronDownIcon height={16} className="fill-white" />
                    </button>
                        <Transition
                            as={Fragment}
                            show={showDropdown}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-[70%]"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-200"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-[70%]"
                        >
                            <div className="absolute top-full space-y-1 left-0 mt-1 bg-lightgray rounded-md shadow-lg shadow-black/50 p-1 z-10 min-w-[160px]">
                                <button
                                    onClick={() => {
                                        setBulkState('input');
                                        setShowDropdown(false);
                                    }}
                                    className={`w-full px-4 py-2 font-medium rounded-lg text-left text-darkgray hover:outline outline-darkgray transition-colors duration-200 ${bulkState === 'input' ? 'bg-darkgray text-white' : ''}`}
                                >
                                    Show Inputs
                                </button>
                                <button
                                    onClick={() => {
                                        setBulkState('preview');
                                        setShowDropdown(false);
                                        if(bulkState === 'preview') {
                                            onFetchSamples();
                                        }
                                    }}
                                    className={`w-full px-4 py-2 font-medium text-left rounded-lg text-darkgray hover:outline outline-darkgray transition-colors duration-200 ${bulkState === 'preview' ? 'bg-darkgray text-white' : ''}`}
                                >
                                    Show Previews
                                </button>
                            </div>
                        </Transition>
                </div>
                <div>
                <button 
                    onClick={openOcrMenu} 
                    className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium hover:bg-opacity-90 sm:block hidden"
                >
                    Import
                </button>
                </div>
                
                { message && <p className="sm:block hidden">{message}</p>}
            </div>
            <div className="sm:hidden flex flex-row gap-4 ">
                    <ComboSelectCategory categoryId={selectedId} onChange={setSelectedId}/>
                    <button 
                    onClick={openOcrMenu} 
                    className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium hover:bg-opacity-90">
                    Import
                </button>
            </div>
            <div className="md:hidden block">
                { message && <p>{message}</p>}
            </div>
            <div className="QUESTIONS flex flex-col gap-8">
                {inputQuestions.map((q, i) => {
                    return <InputQuestion 
                    inputQuestionObj={q} 
                    key={i} 
                    onUpdate={(name: string, value: string | boolean | null) => handleQuestionUpdate(i, name, value)}
                    onUpdateTemplate={(name: string, value: string | RVClient[] | PVClient[]) => handleQuestionUpdateTemplate(i, name, value)}
                    tab={q.tab || 'input'}
                    setTab={(tab) => handleSwitchTab(tab, i)}
                    onDelete={() => handleDeleteQuestion(i)}
                    /> 
                })}
            </div>
            <div className="ADD BUTTON mx-auto my-4">
                <button className="bg-darkgray text-white px-8 py-4 text-lg rounded-full font-medium" onClick={handleAddInputQuestion}>
                Add question
                </button>
            </div>
            <div className="BOTTOM BUTTONS flex flex-row justify-end mx-16 mb-24 gap-8 items-center">
                {message && <p className="">{message}</p>}
                <div className="relative" onMouseEnter={() => {
                    setShowUploadDropdown(true);
                }}
                onMouseLeave={() => {
                    setShowUploadDropdown(false);
                }}>
                    <button 
                        onClick={() => {
                            onSubmit(true);
                            setShowUploadDropdown(false);
                        }}
                        className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium hover:bg-opacity-90 flex items-center gap-2"
                    >
                        Upload approved ones
                        <ChevronDownIcon height={16} className="fill-white" />
                    </button>
                    <Transition
                        as={Fragment}
                        show={showUploadDropdown}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-[70%]"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-[70%]"
                    >
                        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-md outline outline-2 outline-darkgray p-1 z-10 min-w-[210px]">
                            <button
                                onClick={() => {
                                    onSubmit(true);
                                    setShowUploadDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left text-darkgray font-medium transition-colors duration-200 hover:bg-darkgray rounded-lg hover:text-white"
                            >
                                Upload approved ones
                            </button>
                            <button
                                onClick={() => {
                                    onSubmit(false);
                                    setShowUploadDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left text-darkgray font-medium transition-colors duration-200 hover:bg-darkgray rounded-lg hover:text-white"
                            >
                                Upload all
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    )
}

function InputQuestion({ 
    inputQuestionObj, 
    onUpdate, 
    onUpdateTemplate,
    tab,
    setTab,
    onDelete }: { 
    inputQuestionObj: BulkInputQuestion, 
    onUpdate: (name: string, value: string | boolean | null) => void, 
    onUpdateTemplate: (name: string, value: string | RVClient[] | PVClient[]) => void,
    tab: 'input' | 'preview' | 'template',
    setTab: (tab: 'input' | 'preview') => void,
    onDelete: () => void }) {

    function setRVs(rvs: RVClient[]) {
        onUpdateTemplate('rvs', rvs);
    }
    function setPVs(pvs: PVClient[]) {
        onUpdateTemplate('pvs', pvs);
    }
    function setRegular(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onUpdate(e.target.name, e.target.value);
    }
    const formattedSampleQuestion = toTeX(inputQuestionObj.sample.question);
    const formattedSampleAnswer = toTeX(inputQuestionObj.sample.answer);
    return (
        <div className="bg-lightgray flex flex-col gap-0 rounded-xl shadow-lg">
            <div className="bg-lightgray rounded-xl md:px-8 px-2 py-6 flex flex-col gap-8 shadow-xl">
            <div className="MENU BAR flex flex-row gap-4 justify-between md:px-8 px-2">
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
                </div>
                </div>
                <div className="flex flex-row md:gap-8 gap-2">
                    <button title="Mark as correct" className="" onClick={() => onUpdate('checked', inputQuestionObj.checked === true ? null : true)}>
                        <img src={inputQuestionObj.checked === true ? HighlightCheck : Check} alt="checkmark" className="h-8 hover:scale-105 duration-150 hover:opacity-70" />
                    </button>
                    <button title="Mark as incorrect" className="" onClick={() => onUpdate('checked', inputQuestionObj.checked === false ? null : false)}>
                        <img src={inputQuestionObj.checked === false ? HighlightCross : Cross} alt="x mark" className="h-8 hover:scale-105 duration-150 hover:opacity-70" />
                    </button>
                    <button title="Delete question" className="hover:opacity-70 duration-150" onClick={onDelete}>
                        <TrashIcon height={32} />
                    </button>
                </div>
            </div>
            {tab === 'input' && 
            <div className="flex flex-col gap-4 md:px-8 px-2" >
            <div className="QUESTION flex flex-col gap-2">
                <h1 className="font-medium text-xl ">Question</h1>
                <TextareaAutosize 
                    className="w-full rounded-lg p-2 outline-none outline-0 border-mywhite" 
                    name="questionInput" 
                    value={inputQuestionObj.questionInput} 
                    onChange={setRegular}
                />
            </div>
            <div className="SOLUTION flex flex-col gap-2">
                <h1 className="font-medium text-xl">Solution</h1>
                <TextareaAutosize 
                className="w-full rounded-lg p-2 outline-none outline-0 border-mywhite" 
                name="solutionInput" 
                value={inputQuestionObj.solutionInput} 
                onChange={setRegular} 
                />
                </div>
            </div>
            }
            {tab === 'preview' && 
            <>
            <div className="px-8 gap-4">
            <h1 className="text-2xl font-medium">Sample question</h1>
            <div className={`CHILDREN h-fit overflow-x-auto overflow-y-clip duration-500 py-3 whitespace-pre-line`}>
                {formattedSampleQuestion}
            </div>
            
            <h1 className="text-lg font-medium">Sample answer</h1>
            <div className={`CHILDREN h-fit overflow-x-auto overflow-y-clip duration-500 py-3 whitespace-pre-line`}>
                {formattedSampleAnswer}
            </div>
            <div className='h-px bg-midgray mb-2' />
            </div>
            <div className={`overflow-hidden px-8`}>
            <div className="VARIABLES flex flex-col md:grid grid-cols-3 gap-8">
                <RVParent variables={inputQuestionObj.template.rvs || []} setVariables={setRVs}/>
                <div className="PVS flex flex-col col-span-2">
                    <h2 className="text-xl font-medium py-2">Processed Variables</h2>
                    <PVParent variables={inputQuestionObj.template.pvs || []} setVariables={setPVs}/>
                </div>
            </div>
            <div className="QNA grid grid-cols-2 gap-8 my-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Question template</h2>
                    <textarea 
                    className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                    placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                    value={inputQuestionObj.template.question} 
                    onChange={e => onUpdateTemplate('question', e.target.value)}/>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Answer template</h2>
                    <textarea 
                    className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                    placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                    value={inputQuestionObj.template.answer} 
                    onChange={e => onUpdateTemplate('answer', e.target.value)}/>
                </div>
                
            </div>
            </div>
            </>
            }
            </div>            
        </div>
    )
}