import { BulkInputQuestion, PVClient, QuestionTemplateType, RVClient } from "../lib/interfaces"
import TextareaAutosize from 'react-textarea-autosize';
import { useState, useEffect } from "react";
import { handleGenerateBulkTemplate, processFile } from "../lib/api/llmApi";
import { Cog6ToothIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FlagIcon } from "@heroicons/react/20/solid";
import { RVParent } from "./generic-comps/CreateQuestion";
import { PVParent } from "./generic-comps/CreateQuestion";
import { handleFetchSampleBulk } from "../lib/api/questionSampleApi";
import Latex from "react-latex-next";
import { handlePostCategoryQuestions } from "../lib/api/createApi";
import { useDebounce } from 'use-debounce';
// import { handleFetchSample } from "../lib/api/questionSampleApi";

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
    flagged: null,
    sample: {
        question: "",
        answer: ""
    },
    canRandomize: null
}

function QuestionItem({ question, index, onChange }: { question: BulkInputQuestion, index: number, onChange: (action: 'update' | 'delete', index: number, question?: BulkInputQuestion) => void }) {
    const [showOriginal, setShowOriginal] = useState(false);
    const [tab, setTab] = useState<'preview' | 'template'>('preview');
    const [debouncedTemplate] = useDebounce(question.template, 1000);

    function setRVs(rvs: RVClient[]) {
        onChange('update', index, {
            ...question,
            template: {
                ...question.template,
                rvs
            }
        });
    }

    function setPVs(pvs: PVClient[]) {
        onChange('update', index, {
            ...question,
            template: {
                ...question.template,
                pvs
            }
        });
    }

    function onUpdateTemplate(field: 'question' | 'answer', value: string) {
        onChange('update', index, {
            ...question,
            template: {
                ...question.template,
                [field]: value
            }
        });
    }

    useEffect(() => {
        async function fetchNewSample() {
            const response = await handleFetchSampleBulk([debouncedTemplate]);
            if (response.success && response.samples && response.samples.length > 0) {
                onChange('update', index, {
                    ...question,
                    sample: response.samples[0]
                });
                console.log(response.samples[0]);
            }
        }
        fetchNewSample();
    }, [debouncedTemplate]);

    return (
        <div className="QUESTION ITEM bg-lightgray rounded-3xl py-4 px-8 flex flex-col gap-6" key={index}>
            <div className="TOP BAR flex flex-row gap-8 justify-between">
                <div className="flex flex-row items-center gap-4 font-normal py-2 px-4 bg-white rounded-lg border-darkgray border">
                    <button onClick={() => setTab('preview')} className={`${tab === 'preview' ? 'font-semibold' : 'font-normal'}`}>Preview</button>
                    <div className="w-px h-full bg-darkgray" />
                    <button onClick={() => setTab('template')} className={`${tab === 'template' ? 'font-semibold' : 'font-normal'}`}>Template</button>
                </div>
                <div className="flex flex-row gap-6">
                <button onClick={() => onChange('delete', index)}><TrashIcon className="w-8 h-8" /></button>
                <button onClick={() => onChange('update', index, {...question, flagged: !question.flagged})}><FlagIcon className={`w-8 h-8  ${question.flagged ? 'text-red-500 hover:text-red-600' : 'hover:text-gray-500'}`} /></button>
                </div>
            </div>
            {tab === 'preview' ? (
                <div className="QUESTION CONTENT flex flex-col gap-2 items-start">
                    {showOriginal ? 
                    <TextareaAutosize className="w-full p-2 rounded-lg outline-none" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('update', index, {...question, questionInput: e.target.value})} value={question.questionInput}></TextareaAutosize>
                    :
                    <>
                    <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-xl">Question</h1>
                    <Latex>{question.sample.question}</Latex>   
                    </div>
                    <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-lg">Solution</h1>
                    <Latex>{question.sample.answer}</Latex>
                    </div>
                    </>
                    }
                    <button className="hover:underline text-sm" onClick={() => setShowOriginal(!showOriginal)}>
                        {showOriginal ? 'Show preview' : 'Show original'}
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden">
                    <div className="VARIABLES flex flex-col md:grid grid-cols-3 gap-4">
                        <RVParent variables={question.template.rvs || []} setVariables={setRVs}/>
                        <div className="PVS flex flex-col col-span-2">
                            <h2 className="text-xl font-medium py-2">Processed Variables</h2>
                            <PVParent variables={question.template.pvs || []} setVariables={setPVs}/>
                        </div>
                    </div>
                    <div className="QNA grid grid-cols-2 gap-4 my-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-medium">Question template</h2>
                            <textarea 
                                className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                                placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                                value={question.template.question} 
                                onChange={e => onUpdateTemplate('question', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-medium">Answer template</h2>
                            <textarea 
                                className='p-2 rounded-lg outline-mywhite min-h-[100px]' 
                                placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" 
                                value={question.template.answer} 
                                onChange={e => onUpdateTemplate('answer', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SmartCategory() {
    const [ocrTab, setOcrTab] = useState<'upload' | 'questions'>('upload');
    const [inputQuestions, setInputQuestions] = useState<BulkInputQuestion[]>([sampleInputQuestion]);
    const [importedQuestions, setImportedQuestions] = useState<BulkInputQuestion[]>([]);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const importedQuestionsItems = importedQuestions?.map((question, index) => (
        <QuestionItem question={question} index={index} onChange={importedQuestionOmni} />
    ));
    function importedQuestionOmni(action: 'update' | 'delete', index: number, question?: BulkInputQuestion) {
        if(action === 'update' && question) {
            setImportedQuestions(iq => iq.map((q, i) => i === index ? question : q));
        } else if(action === 'delete') {
            setImportedQuestions(iq => iq.filter((_, i) => i !== index));
        }
    }
    function inputQuestionOmni(action: 'update' | 'delete', index: number, question?: BulkInputQuestion) {
        if(action === 'update' && question) {
            setInputQuestions(iq => iq.map((q, i) => i === index ? question : q));
        } else if(action === 'delete') {
            setInputQuestions(iq => iq.filter((_, i) => i !== index));
        }
    }
    // const [isGenerating, setIsGenerating] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [ocrData, setOcrData] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsImportOpen(false);
            }
        };

        if (isImportOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isImportOpen]);

    // async function onGenerateTemplates() {
    //     setMessage('');
    //     setIsGenerating(true);
        
    //     // First validate all questions have content
    //     const items = inputQuestions.map(iq => {
    //         if (!iq.questionInput.trim()) {
    //             setMessage('All questions must have content');
    //             setIsGenerating(false);
    //             return;
    //         }
    //         return [iq.questionInput, iq.solutionInput];
    //     }).filter((item): item is string[] => Boolean(item));

    //     if (items.length < inputQuestions.length) {
    //         return;
    //     }

    //     // Split items into chunks of 10
    //     const chunkSize = 10;
    //     const chunks = [];
    //     for (let i = 0; i < items.length; i += chunkSize) {
    //         // Note: slice(i, i + chunkSize) is safe even when i + chunkSize > items.length
    //         // It will automatically return elements from i to the end of the array
    //         chunks.push(items.slice(i, i + chunkSize));
    //     }

    //     // Process each chunk sequentially
    //     for (let i = 0; i < chunks.length; i++) {
    //         const chunk = chunks[i];
    //         setMessage(`Processing chunk ${i + 1} of ${chunks.length}...`);
            
    //         const response = await handleGenerateBulkTemplate(chunk);
    //         if (!response.success) {
    //             setMessage(response.message || 'Failed to generate templates');
    //             setIsGenerating(false);
    //             return;
    //         }

    //         // Update the questions for this chunk
    //         setImportedQuestions(oldImportedQuestions => {
    //             const newTemplates = response.templates.map((template: { question: string; answer: string; rvs: RVClient[]; pvs: PVClient[] }) => ({
    //                 ...sampleInputQuestion,
    //                 template: {
    //                     question: template.question || '',
    //                     answer: template.answer || '',
    //                     rvs: template.rvs || [],
    //                     pvs: template.pvs || []
    //                 },
    //                 checked: true
    //             }));
                
    //             // Concatenate new templates to existing ones
    //             return [...(oldImportedQuestions || []), ...newTemplates];
    //         });
    //     }

    //     setMessage('All templates generated successfully');
    //     setIsGenerating(false);
    // }
    async function onUploadFile() {
        setMessage('');
        setIsUploading(true);
        const cleanup = () => setIsUploading(false);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.docx,image/*';
        input.onabort = cleanup;
        input.oncancel = cleanup;
        input.onchange = async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (!files || files.length === 0) return;
            
            setUploadedFile(files[0]);
            setIsUploading(false);
        };
        input.click();
    }
    async function onProcessFile() {
        if (!uploadedFile) {
            setMessage('Please upload a file first');
            return;
        }

        setMessage('');
        setIsProcessing(true);
        
        try {
            const result = await processFile(uploadedFile);
            
            if (!result.success) {
                setMessage(result.message || 'Failed to process file');
                return;
            }
            
            // Update OCR data with the extracted text
            setOcrData(result.ocr_text || '');
            const fixedQuestions = result.fixed?.map(q => ({
                ...sampleInputQuestion,
                questionInput: q,
                template: {
                    question: q,
                    answer: '',
                    rvs: [],
                    pvs: []
                },
                sample: {
                    question: q,
                    answer: ''
                },
                canRandomize: false
            })) || [];
            setImportedQuestions(oldQuestions => [...oldQuestions, ...fixedQuestions]);
            
            // Process randomisable questions in batches of 10
            const randomisableQuestions = result.randomisable || [];
            const batchSize = 10;
            
            for (let i = 0; i < randomisableQuestions.length; i += batchSize) {
                const batch = randomisableQuestions.slice(i, i + batchSize);
                const batchInputs = batch.map(q => [q, '']);
                
                const templateResult = await handleGenerateBulkTemplate(batchInputs);
                // const samples = await handleFetchSampleBulk(templateResult.templates);
                
                if (templateResult.success && templateResult.templates) {
                    const templatedQuestions = templateResult.templates.map((templateObj: { template: QuestionTemplateType, sample: { question: string, answer: string } }, idx: number) => ({
                        ...templateObj,
                        questionInput: batch[idx],
                        solutionInput: '',
                        flagged: false,
                        canRandomize: true,
                    }));
                    
                    setImportedQuestions(oldQuestions => [...oldQuestions, ...templatedQuestions]);
                } else {
                    console.error('Failed to generate templates for batch:', i);
                    setMessage('Some templates failed to generate');
                }
            }
            
            setOcrTab('questions');
        } catch (err) {
            console.error('Error processing file:', err);
            setMessage('Failed to process file');
        } finally {
            setIsProcessing(false);
            setUploadedFile(null);
        }
    }
    async function reprocessFlagged() {
        setMessage('');
        setIsProcessing(true);
        
        try {
            // Get all flagged questions and their indices
            const flaggedQuestions = importedQuestions
                .map((q, index) => ({ question: q, index }))
                .filter(({ question }) => question.flagged);

            if (flaggedQuestions.length === 0) {
                setMessage('No flagged questions to process');
                return;
            }

            // Process in batches of 10
            const batchSize = 10;
            for (let i = 0; i < flaggedQuestions.length; i += batchSize) {
                const batch = flaggedQuestions.slice(i, i + batchSize);
                const batchInputs = batch.map(({ question }) => [question.questionInput, '']);
                
                const templateResult = await handleGenerateBulkTemplate(batchInputs);
                
                if (templateResult.success && templateResult.templates) {
                    setImportedQuestions(oldQuestions => {
                        const newQuestions = [...oldQuestions];
                        batch.forEach(({ index }, batchIdx) => {
                            const templateObj = templateResult.templates[batchIdx];
                            newQuestions[index] = {
                                ...templateObj,
                                questionInput: batch[batchIdx].question.questionInput,
                                solutionInput: '',
                                flagged: false,
                                canRandomize: true
                            };
                        });
                        return newQuestions;
                    });
                } else {
                    console.error('Failed to generate templates for batch:', i);
                    setMessage('Some templates failed to generate');
                }
            }
        } catch (err) {
            console.error('Error reprocessing flagged questions:', err);
            setMessage('Failed to reprocess flagged questions');
        } finally {
            setIsProcessing(false);
        }
    }
    async function onPostCategory() {
        setIsPosting(true);
        const response = await handlePostCategoryQuestions(title, description, tags, isPublic, inputQuestions.map(q => q.template));
        if(response.success) {
            setMessage('Category created successfully');
        } else {
            setMessage('Failed to create category: ' + response.message);
        }
        setIsPosting(false);
    }

    const handleAddTag = () => {
        if (tagsInput.trim() !== '') {
            setTags((prevTags) => [...prevTags, tagsInput.trim()]);
            setTagsInput(''); // Clear the input field
        }
    };

    return (
    <div className="flex flex-col gap-4 mx-4 lg:mx-16 md:mx-12 my-12">
        {isSettingsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsSettingsOpen(false)}>
                <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-4 rounded-xl py-6 px-8 max-w-[600px] w-full mx-4">
                    <div className='flex flex-row gap-4 justify-between'>
                        <h3 className='font-medium text-xl'>Settings</h3>
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSettingsOpen(false)}>✕</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Public Category</h4>
                                <p className="text-sm text-gray-500">Make this category visible to all users</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-darkgray"></div>
                            </label>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-medium">Tags</h4>
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="text" 
                                    className='outline-mywhite py-1 px-2 rounded-lg w-full'
                                    onKeyDown={e => { if(e.key === 'Enter') handleAddTag() }} 
                                    value={tagsInput} 
                                    placeholder='Type your tags here'
                                    onChange={e => setTagsInput(e.target.value)} 
                                />
                                <ul className="flex flex-wrap gap-3 h-24 p-4 overflow-scroll no-scrollbar bg-white rounded-xl border-[2px] border-darkgray">
                                    {tags.map((tag, i) => { 
                                        return (
                                        <li key={i}>
                                            <div className="bg-[#444341] rounded-xl pl-4 pr-3 py-1 flex flex-row gap-1 items-center">
                                                <p className="text-white text-sm font-semibold">{tag}</p>
                                                <button onClick={() => setTags(t => t.filter((_currTag, index) => index !== i))}>
                                                    <XMarkIcon className="text-white h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {isImportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsImportOpen(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white flex flex-col gap-4 rounded-xl py-8 px-12 max-w-[1120px] w-full mx-4 h-[90vh] overflow-y-auto">
                <div className='flex flex-row gap-4 justify-between'>
                <h3 className='font-medium text-xl'>Import</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsImportOpen(false)}>✕</button>
                </div>
                <div className='flex items-center gap-8 justify-between'>
                    <div className="flex flex-row items-center gap-3">
                        <button onClick={() => setOcrTab('upload')} className={`text-md ${ocrTab === 'upload' ? 'font-semibold' : 'font-normal'}`}>Upload</button>
                        <div className="w-px h-4 bg-darkgray" />
                        <button onClick={() => setOcrTab('questions')} className={`text-md ${ocrTab === 'questions' ? 'font-semibold' : 'font-normal'}`}>Processing</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <p>{uploadedFile?.name || 'No file uploaded'}</p>
                        {uploadedFile && (
                            <button 
                                onClick={() => setUploadedFile(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={uploadedFile ? onProcessFile : reprocessFlagged} 
                        disabled={(!uploadedFile && importedQuestions.filter(q => q.flagged).length === 0) || isProcessing}
                        className='py-2 px-4 font-medium text-white bg-darkgray rounded-lg disabled:opacity-50'
                    >
                        {isProcessing ? 'Processing...' : uploadedFile || importedQuestions.filter(q => q.flagged).length <= 0 ? 'Process' : 'Re-process flagged'}
                    </button>
                </div>
                { ocrTab === 'upload' &&
                <div className='flex flex-col gap-4'>
                <button 
                    onClick={onUploadFile} 
                    disabled={isUploading}
                    className={`w-full py-12 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-darkgray transition-colors ${
                        false 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-white'
                    }`}
                >
                    {isUploading ? 'Importing...' : 'Import PDF or image'}
                </button>
                {/** TODO: Raw/Rendered */}
                <TextareaAutosize
                    className="w-full p-4 font-mono text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkgray"
                    value={ocrData}
                    placeholder="1) What is 4 + 5?   2) If I run at 5 metres per second, how far will I have ran in 5 seconds?"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOcrData(e.target.value)}
                />
                </div>
                }
                {ocrTab === 'questions' && <div className='flex flex-col gap-4'>
                    <div className='outline outline-slate-300 py-8 rounded-lg px-12 flex flex-col gap-4 overflow-y-scroll h-[450px]'>
                        {isProcessing && <p className="mx-auto my-4">Loading...</p>}
                        {importedQuestionsItems}
                    </div>
                    <div className="flex flex-row gap-4 justify-end items-center">
                        {message && <p className="text-sm text-gray-500">{message}</p>}
                        <button 
                            onClick={() => {
                                const nonFlagged = importedQuestions.filter(q => !q.flagged);
                                setInputQuestions(prev => [...prev, ...nonFlagged]);
                                setImportedQuestions(prev => prev.filter(q => q.flagged));
                            }}
                            className="bg-darkgray text-white px-4 py-2 rounded-lg font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                            disabled={importedQuestions.filter(q => !q.flagged).length === 0}
                        >
                            Add (non-flagged) Questions
                        </button>
                    </div>
                </div>}
            </div>
        </div>
        )}
        <div className="HEADING py-2 flex flex-col">
        <div className="flex flex-row justify-between items-center">
            <h1 className="font-semibold text-5xl">Create set</h1>
            {message && <p>{message}</p>}
            <div>

            <button disabled={inputQuestions.length === 0 || isPosting} onClick={onPostCategory} className={`bg-darkgray text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform ${inputQuestions.length === 0 || isPosting ? 'opacity-50' : ''}`}>
                {isPosting ? 'Creating...' : 'Create'}
            </button>
            </div>
        </div>
        </div>
        <div className="INPUT FIELDS flex flex-col gap-2">
        <input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} className="w-full p-2 rounded-md outline-gray-200 outline-1"  placeholder='Enter a title, like "Calculus: first-order differential equations"'/>
        <TextareaAutosize value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Add a description..." className="w-full p-2 min-h-[100px] rounded-md outline-gray-200 outline-1" />
        </div>
        <div className='ACTION BAR my-4 gap-16 flex flex-row justify-between'>
            <div>
            <button className='bg-darkgray text-white px-6 py-2 rounded-lg font-medium' onClick={() => setIsImportOpen(true)}>Import</button>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 text-darkgray px-6 py-2 rounded-lg font-medium text-lg">
                <Cog6ToothIcon className="w-8 h-8" />
            </button>
        </div>
        <div className="flex flex-col gap-4">
            {inputQuestions.map((question, index) => (
                <QuestionItem question={question} index={index} onChange={inputQuestionOmni} />
            ))}
            <button 
                onClick={() => setInputQuestions(prev => [...prev, sampleInputQuestion])}
                className="bg-darkgray text-white px-8 py-4 duration-300 rounded-full font-medium hover:scale-105 w-fit mx-auto text-lg mt-8 mb-4"
            >
                Add Question
            </button>
            <div className="flex justify-end">
                <button 
                    disabled={inputQuestions.length === 0 || isPosting} 
                    onClick={onPostCategory} 
                    className={`bg-darkgray text-white px-8 py-4 rounded-xl text-lg font-medium hover:scale-105 transition-transform ${inputQuestions.length === 0 || isPosting ? 'opacity-50' : ''}`}
                >
                    {isPosting ? 'Creating...' : 'Create'}
                </button>
            </div>
        </div>
    </div>
    )
}
