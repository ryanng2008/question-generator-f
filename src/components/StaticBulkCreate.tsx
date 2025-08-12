import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { handlePostStaticQuestions } from "../lib/api/createApi";
import { fetchCategoryDetails } from "../lib/api/categoryDetailsApi";
import { Link, useParams } from "react-router-dom";
import { Category } from "../lib/interfaces";
import ComboSelectCategory from "./generic-comps/ui/ComboSelectCategory";
import TagsInput from "./generic-comps/ui/TagsInput";
import TextareaAutosize from 'react-textarea-autosize';

interface StaticQuestion {
    question: string;
    answer: string;
    tags: string[];
}

const sampleStaticQuestion: StaticQuestion = {
    question: "",
    answer: "",
    tags: []
};

export default function StaticBulkCreate() {
    const categoryId = useParams().categoryId || '-1';
    const [selectedId, setSelectedId] = useState(categoryId);
    const [questions, setQuestions] = useState<StaticQuestion[]>([sampleStaticQuestion]);
    const [category, setCategory] = useState<Category | null>(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (categoryId && categoryId !== '-1') {
            fetchCategoryDetails(categoryId)
                .then(data => setCategory(data))
                .catch(error => console.error('Error fetching category details:', error));
        }
    }, [categoryId]);

    function handleQuestionUpdate(index: number, field: 'question' | 'answer' | 'tags', value: string | string[]) {
        const nextQuestions = questions.map((q, i) => {
            return (i === index) ? {...q, [field]: value} : q;
        });
        setQuestions(nextQuestions);
    }

    function handleAddQuestion() {
        setQuestions(prevQuestions => [...prevQuestions, {...sampleStaticQuestion}]);
    }

    function handleDeleteQuestion(index: number) {
        if (questions.length > 1) {
            setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
        }
    }

    async function handleSubmit() {
        setMessage('');
        if (selectedId === '-1') {
            setMessage('Please select a category');
            return;
        }

        // Validate questions
        const validQuestions = questions.filter(q => q.question.trim() !== '');
        if (validQuestions.length === 0) {
            setMessage('Please add at least one question');
            return;
        }

        // Check for empty questions
        const hasEmptyQuestions = questions.some(q => q.question.trim() === '');
        if (hasEmptyQuestions) {
            setMessage('Some questions are empty. Please fill them in or remove them.');
            return;
        }

        setIsUploading(true);
        setMessage('Uploading questions...');

        try {
            const result = await handlePostStaticQuestions(questions, selectedId);
            if (result.success) {
                setMessage(`Successfully uploaded ${questions.length} static questions!`);
                // Reset form
                setQuestions([sampleStaticQuestion]);
            } else {
                setMessage(result.message || 'Failed to upload questions');
            }
        } catch (error) {
            setMessage('Error uploading questions');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 mx-4 lg:mx-16 md:mx-12 my-8">
            <div className="TITLE py-2 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        {/* <Link 
                            to={categoryId && categoryId !== '-1' ? `/library/${categoryId}` : `/library`}
                            className="text-darkgray hover:text-darkgray/80 hover:underline duration-300 text-lg"
                        >
                            ← Go back
                        </Link> */}
                    </div>
                    <h1 className="font-semibold text-6xl">Static Question Upload</h1>
                    {category && (
                        <p className="text-xl text-gray-600 font-medium">
                            for {category.title}
                        </p>
                    )}
                    <p className="text-lg text-gray-500">
                        Upload questions without templates - no random variables or processed variables needed
                    </p>
                </div>
            </div>

            <div className="ACTIONBAR flex flex-row items-center md:gap-8 gap-4">
                <div className="sm:block hidden">
                    <ComboSelectCategory categoryId={selectedId} onChange={setSelectedId}/>
                </div>
                <button 
                    onClick={handleAddQuestion}
                    className="rounded-xl bg-darkgray text-white px-6 py-2 font-medium hover:bg-opacity-90"
                >
                    Add Question
                </button>
                {message && <p className="sm:block hidden">{message}</p>}
            </div>

            <div className="sm:hidden flex flex-row gap-4">
                <ComboSelectCategory categoryId={selectedId} onChange={setSelectedId}/>
            </div>
            <div className="md:hidden block">
                {message && <p>{message}</p>}
            </div>

            <div className="QUESTIONS flex flex-col gap-6">
                {questions.map((question, index) => (
                    <StaticQuestionInput
                        key={index}
                        question={question}
                        index={index}
                        onUpdate={handleQuestionUpdate}
                        onDelete={() => handleDeleteQuestion(index)}
                        canDelete={questions.length > 1}
                    />
                ))}
            </div>

            <div className="SUBMIT flex flex-row gap-4 items-center mt-8">
                <button 
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className={`px-8 py-3 font-medium text-lg rounded-lg shadow-lg ${
                        isUploading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-darkgray text-white hover:scale-105 duration-300'
                    }`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Questions'}
                </button>
                <p className="text-gray-600">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} ready to upload
                </p>
            </div>
        </div>
    );
}

function StaticQuestionInput({ 
    question, 
    index, 
    onUpdate, 
    onDelete, 
    canDelete 
}: { 
    question: StaticQuestion, 
    index: number,
    onUpdate: (index: number, field: 'question' | 'answer' | 'tags', value: string | string[]) => void,
    onDelete: () => void,
    canDelete: boolean
}) {
    return (
        <div className="bg-lightgray flex flex-col gap-4 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Question {index + 1}</h3>
                {canDelete && (
                    <button 
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-800 hover:scale-110 duration-200"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
            
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-lg">Question Text</label>
                    <TextareaAutosize
                        placeholder="What is the derivative of x²?"
                        className="w-full p-3 rounded-lg border border-gray-300 resize-none min-h-[100px] focus:outline-none focus:border-darkgray"
                        value={question.question}
                        onChange={(e) => onUpdate(index, 'question', e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-lg">Answer (Optional)</label>
                    <TextareaAutosize
                        placeholder="2x"
                        className="w-full p-3 rounded-lg border border-gray-300 resize-none min-h-[100px] focus:outline-none focus:border-darkgray"
                        value={question.answer}
                        onChange={(e) => onUpdate(index, 'answer', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <label className="font-medium text-lg">Tags</label>
                <TagsInput 
                    tags={question.tags} 
                    onChange={(tags) => onUpdate(index, 'tags', tags)} 
                    placeholder="Add tags like 'calculus', 'derivatives'..."
                />
                <p className="text-sm text-gray-600">Press Enter or comma to add tags. Tags help organize and find questions.</p>
            </div>
        </div>
    );
}