export async function getOrderId() {
    try {
        const response = await fetch("/payment/create/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: price[0].price * 100,
            }),
        });
        const data = await response.json();
        return data.order.id;
    } catch (error) {
        console.error(error);
    }
}