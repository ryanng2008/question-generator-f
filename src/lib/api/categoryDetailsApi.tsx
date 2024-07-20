export async function fetchCategoryDetails(categoryId: string) {
    try {
        const response = await fetch(`/api/categorydetails/${categoryId}`);
        if(!response.ok) throw new Error(`Failed to fetch  details for category ID ${categoryId}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching details for category ID ${categoryId}:`, error)
        throw error;
    }
}