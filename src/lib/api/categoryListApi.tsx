export async function fetchCategoryList() {
    try {
        const response = await fetch('https://66a5a7305dc27a3c190bd6f7.mockapi.io/categorylist');
        if(!response.ok) throw new Error('Failed to fetch category list')
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching category list:', error)
        throw error;
    }
}