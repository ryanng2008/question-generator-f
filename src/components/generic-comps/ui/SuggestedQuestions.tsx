import { useState, useEffect } from 'react';
import { GeneratedQuestionType } from '../../../lib/interfaces';
import { fetchQuestionSuggestions, SuggestionsResponse } from '../../../lib/api/questionSuggestionsApi';
import { toTeX } from '../../../lib/shortcuts';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';

interface SuggestedQuestionsProps {
    categoryId: string;
}

function SuggestedQuestions({ categoryId }: SuggestedQuestionsProps) {
    // State management for suggestions panel
    const [isExpanded, setIsExpanded] = useState(false);
    const [suggestions, setSuggestions] = useState<GeneratedQuestionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response: SuggestionsResponse = await fetchQuestionSuggestions(categoryId, 10);
            if (response.success && response.suggestions) {
                setSuggestions(response.suggestions);
            } else {
                setError(response.message || 'Failed to fetch suggestions');
                setSuggestions([]);
            }
        } catch (err) {
            setError('Failed to fetch suggestions');
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isExpanded && suggestions.length === 0) {
            fetchSuggestions();
        }
    }, [isExpanded, categoryId]);

    const handleAddQuestion = async (question: GeneratedQuestionType) => {
        // TODO: Implement adding question to category
        // This would involve copying the question to the current category
        console.log('Adding question to category:', question);
        alert('Add to category functionality will be implemented soon!');
    };

    const SuggestionItem = ({ question, index }: { question: GeneratedQuestionType; index: number }) => {
        const [showAnswer, setShowAnswer] = useState(false);
        const formattedQuestion = toTeX(question.question);
        const formattedAnswer = toTeX(question.answer);

        return (
            <div className='p-4 my-2 rounded-xl bg-blue-50 border border-blue-200 flex flex-col gap-2'>
                <div className='flex flex-row justify-between items-start'>
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="flex flex-row items-center gap-3">
                            <h3 className='text-sm font-medium text-blue-600'>Suggestion {index + 1}</h3>
                            {question.tags && question.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {question.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                    {question.tags.length > 3 && (
                                        <span className="text-blue-500 text-xs">+{question.tags.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-700 overflow-x-auto whitespace-pre-line">
                            {formattedQuestion}
                        </div>
                    </div>
                    <button
                        onClick={() => handleAddQuestion(question)}
                        className="ml-2 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg duration-300 flex items-center gap-1"
                        title="Add to category"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>
                
                <div className={`ANSWER flex flex-col gap-1 ${showAnswer ? 'h-auto' : 'h-0'} duration-300 overflow-hidden`}>
                    <div className='h-px bg-blue-200' />
                    <div className='text-sm text-gray-600 whitespace-pre-line'>
                        {formattedAnswer}
                    </div>
                </div>
                
                <div className='flex'>
                    <button 
                        className="text-xs py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg duration-300" 
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        {showAnswer ? 'Hide' : 'Show'} Answer
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-4 lg:px-12 md:px-8 px-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 duration-300 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        {isExpanded ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                        <h2 className="text-lg font-semibold text-gray-700">Suggested Questions</h2>
                        {suggestions.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                                {suggestions.length}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-500">
                        Based on tags from your questions
                    </span>
                </button>

                {isExpanded && (
                    <div className="border-t border-gray-200 p-4">
                        {loading && (
                            <div className="flex justify-center py-8">
                                <div className="text-gray-500">Loading suggestions...</div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                {error}
                            </div>
                        )}

                        {!loading && !error && suggestions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No suggestions available.</p>
                                <p className="text-sm mt-1">Add tags to your questions to get better suggestions!</p>
                            </div>
                        )}

                        {!loading && !error && suggestions.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Found {suggestions.length} questions that might fit your category
                                    </p>
                                    <button
                                        onClick={fetchSuggestions}
                                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg duration-300"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {suggestions.map((suggestion, index) => (
                                        <SuggestionItem key={suggestion.id} question={suggestion} index={index} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuggestedQuestions;