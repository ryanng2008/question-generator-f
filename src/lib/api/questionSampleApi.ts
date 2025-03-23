import { PVClient, QuestionTemplateType, RVClient } from "../interfaces";
import BASE_URL from "./apiConfig";

export async function handleFetchSample(question: string, rvs: RVClient[], pvs: PVClient[], answer: string) {
    try {
        const response = await fetch(`${BASE_URL}/previewquestion`, {
            method: 'POST',
            body: JSON.stringify({ question, rvs, pvs, answer }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(!response.ok) throw new Error(`It didn't fetch`)
        const data = await response.json();
        if(!data) {
            return { success: false, question: '', answer: '' }
        }
        return { success: true, question: data.question, answer: data.answer }
    } catch (error) {
        console.error(`Error fetching sample for question:`, error);
        return { success: false, question: '', answer: '' }
    }
}

export async function handleFetchSampleBulk(items: QuestionTemplateType[]) {
    try {
        const response = await fetch(`${BASE_URL}/previewquestionbulk`, {
            method: 'POST',
            body: JSON.stringify({ items }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(!response.ok) throw new Error(`It didn't fetch`) 
        const data = await response.json();
        if(!data) {
            return { success: false, questions: [] }
        }
        return { success: true, samples: data.data }
    } catch (error) {
        console.error(`Error fetching samples for questions:`, error);
        return { success: false, samples: [] }
    }
}   

