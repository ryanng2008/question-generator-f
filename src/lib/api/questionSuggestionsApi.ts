import BASE_URL from "./apiConfig";
import { GeneratedQuestionType } from '../interfaces';

export interface SuggestionsResponse {
    success: boolean;
    suggestions?: GeneratedQuestionType[];
    message?: string;
}

export async function fetchQuestionSuggestions(categoryId: string, limit: number = 10): Promise<SuggestionsResponse> {
    try {
        const response = await fetch(`${BASE_URL}/suggestquestions/${categoryId}/${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch question suggestions');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching question suggestions:', error);
        throw error;
    }
}