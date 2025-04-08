import BASE_URL from "./apiConfig";

export async function extractQuestionsSplit(ocrData: string) {
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
        return { success: true, questions: data.questions }
    } catch (error) {
        return { success: false, message: 'Bruh' }
    }
}   

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
        
        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: 'Not authenticated' }
            }
            if (response.status === 400) {
                return { success: false, message: 'Missing required field: text' }
            }
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json();
        if (!data) {
            return { success: false, message: 'No data received from server' }
        }
        
        return data;
    } catch (error) {
        console.error('Error processing questions:', error);
        return { success: false, message: 'Failed to process questions' }
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

interface ProcessFileResponse {
    success: boolean;
    questions?: string[];
    fixed?: string[];
    randomisable?: string[];
    ocr_text?: string;
    message?: string;
}

export async function processFile(file: File): Promise<ProcessFileResponse> {
    const token = localStorage.getItem("token")
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/processfile`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        
        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: 'Not authenticated' }
            }
            if (response.status === 400) {
                return { success: false, message: 'Invalid file or no file provided' }
            }
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json();
        if (!data) {
            return { success: false, message: 'No data received from server' }
        }
        
        return data;
    } catch (error) {
        console.error('Error processing file:', error);
        return { success: false, message: 'Failed to process file' }
    }
}