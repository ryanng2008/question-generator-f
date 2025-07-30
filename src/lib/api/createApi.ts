import { PVClient, QuestionTemplateType, RVClient } from "../interfaces";
import BASE_URL from "./apiConfig";

export async function handlePostQuestions(questions: QuestionTemplateType[], categoryId: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/postquestions`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: questions,
                categoryid: categoryId
            })
        });
        if(!response.ok) {
            throw new Error(`Failed to post questions. Server responded with status ${response.status}`);
        }
        const data = response.json();
        return data;
    } catch (error) {
        console.error('Error posting questions:', error);
        return { success: false, message: 'An error occurred while posting the questions.' };
    }
}

export async function handlePostQuestion(questionString: string, rvs: RVClient[], pvs: PVClient[], answerString: string, tags: string[], categoryId: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/postquestion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: questionString,
                rvs: rvs,
                pvs: pvs,
                answer: answerString,
                tags: tags,
                categoryid: categoryId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to post question. Server responded with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Response is not in JSON format.');
        }
    } catch (error) {
        console.error('Error posting this question:', error);
        return { success: false, message: 'An error occurred while posting the question.' };
    }
}

export async function handlePostCategoryQuestions(title: string, description: string, tags: string[], publicCategory: boolean, questions: QuestionTemplateType[]) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/postcategoryquestions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                tags: tags, 
                publiccategory: publicCategory,
                questions: questions
            })
        });
        if(!response.ok) {
            throw new Error(`Failed to post category questions. Server responded with status ${response.status}`);
        }
        const data = response.json();
        return data;
    } catch (error) {
        console.error('Error posting category questions:', error);
        return { success: false, message: 'An error occurred while posting the category questions.' };  
    }
}   

export async function handlePostCategory(title: string, description: string, tags: string[], publicCategory: boolean) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/postcategory`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title: title,
                description: description,
                tags: tags,
                publiccategory: publicCategory
            })
        });
        if(!response.ok) {
            throw new Error(`Failed to post question. Server responded with status ${response.status}`);
        }
        const data = response.json();
        return data

    } catch (error) {
        console.error('Error posting this question:', error);
        return { success: false, message: 'An error occurred while posting the category.' };
    }

}

export async function handleEditQuestion(questionId: string, questionString: string, rvs: RVClient[], pvs: PVClient[], answerString: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/editquestion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: questionString,
                rvs: rvs,
                pvs: pvs,
                answer: answerString,
                questionid: questionId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to edit question. Server responded with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Response is not in JSON format.');
        }
    } catch (error) {
        // console.error('Error posting this question:', error);
        return { success: false, message: error };
    }
}

export async function handlePostStaticQuestion(questionString: string, answerString: string, tags: string[], categoryId: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/poststaticquestion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: questionString,
                answer: answerString,
                tags: tags,
                categoryid: categoryId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to post static question. Server responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error posting static question:', error);
        return { success: false, message: 'An error occurred while posting the static question.' };
    }
}

export async function handlePostStaticQuestions(questions: {question: string, answer: string, tags?: string[]}[], categoryId: string) {
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/poststaticquestions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: questions,
                categoryid: categoryId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to post static questions. Server responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error posting static questions:', error);
        return { success: false, message: 'An error occurred while posting the static questions.' };
    }
}