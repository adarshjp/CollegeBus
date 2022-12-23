export async function createNewPassenger(passenger) {
    try {
        const res = await fetch("/newPassenger", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ passenger }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}