export async function getPrice(boardingpt) {
    try {
        const response = await fetch('/getPrice', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ boardingpt }),
        });
        return response.json();
    } catch (error) {
        throw error;
    }
}