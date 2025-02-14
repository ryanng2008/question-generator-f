import BASE_URL from "./apiConfig";

export async function fetchQuestionDetails(questionId: string) {
    if(!questionId) {
        return 0
    }
    try {
        const response = await fetch(`${BASE_URL}/questiondetails/${questionId}`);
        if(!response.ok) throw new Error(`Failed to fetch  details for question ID ${questionId}`)
        const data = await response.json();
        if(!data) {
            return 0
        }
        return data;
    } catch (error) {
        console.error(`Error fetching details for question ID ${questionId}:`, error);
        return 0
    }
}