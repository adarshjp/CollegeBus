export async function getSeats(boardingpt) {
    try {
        const response = await fetch('/seats', {
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