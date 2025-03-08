import BASE_URL from "./apiConfig"

export async function fetchStartSR(categoryId: string) {
    if(!categoryId) {
        return null
    }
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/startsr/${categoryId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if(!response.ok) throw new Error(`Failed to fetch start repetition, category ID ${categoryId}`)
        const data = await response.json();
        if(data) {
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error(`Error:`, error);
        return null
    }
}

export async function fetchNextSR(categoryId: string, questionId: string, difficulty: number) {
    if(!categoryId || !questionId) {
        console.log('no cat id or question id')
        return null
    }
    const token = localStorage.getItem("token")
    try {
        const response = await fetch(`${BASE_URL}/continuesr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token for authentication
            },
            body: JSON.stringify({
              cid: categoryId,
              qid: questionId,
              difficulty: difficulty,
            }),
          });
        if(!response.ok) throw new Error(`Failed to fetch next question in stack category ID ${categoryId}; questionID ${questionId}; difficulty ${difficulty}`)
        const data = await response.json();
        if(data) {
            return data
        } else {
            console.log('no data.question')
            return null
        }
    } catch (error) {
        console.error(`Error:`, error);
        return null
    }
}