import { getOrderId } from "./getOrderId.js"
export async function flow(input) {
    try {
        const orderId = await getOrderId();
        const options = {
            key: key,
            amount: price[0].price * 100,
            currency: "INR",
            name: "XYZ Education Trust",
            description: "Bus pass fee payment",
            image: "https://yt3.ggpht.com/ytc/AMLnZu-3U3Uuy2liuzEkuUvszFTwyh8k3Es3x7Ei3JBXaA=s900-c-k-c0x00ffffff-no-rj",
            order_id: orderId,
            handler: (response) => verifyPayment(response, input),
            prefill: {
                name: input.name,
                email: input.email,
                contact: input.phno,
            },
            notes: {
                address: "Nitte Education Trust, Mangaluru, Karnataka",
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", (response) => {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        rzp1.open();
    } catch (error) {
        console.error(error);
    }
}