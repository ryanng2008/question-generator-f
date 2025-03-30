import BASE_URL from "./apiConfig";

export async function extractQuestions(ocrData: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/processquestions`, {
            method: 'POST',
            body: JSON.stringify({ text: ocrData }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        })
        if(!response.ok) throw new Error(`It didn't fetch`)
        const data = await response.json();
        if(!data) {
            return { success: false, message: 'Data is not there - weird' }
        }
        return data
    } catch (error) {
        console.error(`Error extracting questions:`, error);
        return { success: false, message: 'Bruh' }
    }
}

export async function handleGenerateTemplate(question: string, solution: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/llmtemplate`, {
            method: 'POST',
            body: JSON.stringify({ question, solution }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
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

export async function handleGenerateBulkTemplate(items: string[][]) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/llmtemplatebulk`, {
            method: 'POST',
            body: JSON.stringify({ inputs: items }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        })
        if(!response.ok) throw new Error(`It didn't fetch properly`)
        const data = await response.json();
        if(!data) {
            return { success: false, message: 'Data is not there or something' }
        }
        return { success: true, templates: data.templates }
    } catch (error) {
        console.error(`Error generating a template with AI:`, error);
        return { success: false, message: 'Bruh' }
    }
}