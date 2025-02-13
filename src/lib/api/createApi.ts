import { PVClient, RVClient } from "../interfaces";
import BASE_URL from "./apiConfig";

export async function handlePostQuestion(questionString: string, rvs: RVClient[], pvs: PVClient[], answerString: string, categoryId: string) {
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