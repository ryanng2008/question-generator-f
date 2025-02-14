import BASE_URL from "./apiConfig";

export async function fetchFullCategoryList() {
    try {
        const response = await fetch(`${BASE_URL}/categorylist`);
        if(!response.ok) throw new Error('Failed to fetch category list')
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching category list:', error)
        return [];
    }
}

export async function fetchCategoryList(searchQuery: string="", tags: string[]=[]) {
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("searchQuery", searchQuery);
        tags.forEach(tag => params.append("tags", tag));

        const url = `${BASE_URL}/filtercategories?${params.toString()}`;

        // Fetch data from the backend
        const response = await fetch(url);
        if (!response.ok) throw new Error('!response.ok');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching category list:', error);
        return [];
    }
}