import BASE_URL from "./apiConfig";

export async function fetchCategoryList() {
    try {
        const response = await fetch(`${BASE_URL}/categorylist`);
        if(!response.ok) throw new Error('Failed to fetch category list')
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching category list:', error)
        throw error;
    }
}