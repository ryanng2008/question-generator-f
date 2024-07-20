export async function fetchQuestionList(categoryId: string, count=-1) {
    
    try {
        const response = await fetch(`/api/questionlist/${categoryId}/${count}`);
        if(!response.ok) throw new Error('Failed to fetch question list')
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching questions:', error)
        throw error;
    }
}