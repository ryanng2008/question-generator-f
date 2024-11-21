import BASE_URL from "./apiConfig";

export async function fetchCategoryDetails(categoryId: string) {
    if(!categoryId) {
        return {
            id: '',
            title: '',
            description: '',
            imageLink: '',
            tags: [],
            author: '',
            questions: [],
          }
    }
    try {
        const response = await fetch(`${BASE_URL}/categorydetails/${categoryId}`);
        if(!response.ok) throw new Error(`Failed to fetch  details for category ID ${categoryId}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching details for category ID ${categoryId}:`, error);
        return []
    }
}

export async function searchCategory(query: string) {
    if(!query) {
        return []
    }
    try {
        const response = await fetch(`${BASE_URL}/categorysearch/${query}`);
        if(!response.ok) throw new Error(`Failed to search categories with ${query}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching details for category ID ${query}:`, error);
        return []
    }
}