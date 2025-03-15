import BASE_URL from "./apiConfig";

export async function handleGenerateTemplate(question: string, solution: string) {
    try {
        const response = await fetch(`${BASE_URL}/llmtemplate`, {
            method: 'POST',
            body: JSON.stringify({ question, solution }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(!response.ok) throw new Error(`It didn't fetch`)
        const data = await response.json();
        if(!data) {
            return { success: false }
        }
        return { success: true, template: data.template }
    } catch (error) {
        console.error(`Error geenerating a template with AI:`, error);
        return { success: false, message: error as string }
    }
}