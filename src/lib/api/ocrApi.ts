import BASE_URL from "./apiConfig";



export async function getOCRPDF(file: File) {
    const token = localStorage.getItem("token")

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/ocrpdf`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to fetch OCR data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error processing PDF:', error);
        return { success: false, message: 'Failed to process PDF' };
    }
}

export async function getOCRImage(file: File) {
    const token = localStorage.getItem("token")

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/ocrimage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData  
        });

        if (!response.ok) {
            throw new Error('Failed to fetch OCR data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error processing image:', error);
        return { success: false, message: 'Failed to process image' };
    }
}