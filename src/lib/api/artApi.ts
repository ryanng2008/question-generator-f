import BASE_URL from "./apiConfig";

export async function fetchRandomArt() {
    try {
        const response = await fetch(`${BASE_URL}/randomart`);
        if(!response.ok) throw new Error(`Random art failed`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching random art:`, error);
        return {}
    }
}