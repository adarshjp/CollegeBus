let price, routeno, seats
import { getPrice } from "./getPrice.js";
import { getSeats } from "./getSeats.js";
import {createNewPassenger} from "./createNewPassenger.js"
document.getElementById("rzp-button1").addEventListener("click", verifyDetails);
window.onload = () => {
    const bt = document.getElementById("boardingpt");
    bt.addEventListener("change", async () => {
        document.getElementById("rzp-button1").disabled = true;
        const boardingpt = bt.value;
        try {
            price = await getPrice(boardingpt);
            seats = await getSeats(boardingpt)
        } catch (error) {
            console.log("Server Error:Unable to fetch price or seats")
        }
        routeno = seats.routeno;
        if (seats.totalseats < 1) {
            swal({
                title: "Oh no!",
                text: "Seat Full!",
                icon: "warning"
            })
            document.getElementById("rzp-button1").value = "Seat Full!"
        } else {
            document.getElementById("rzp-button1").disabled = false;
            document.getElementById("rzp-button1").value = 'Pay ₹' + price[0].price
        }
    });
}
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
export async function verifyDetails() {
    if (validate()) {
        const payment = await swal({
            title: 'Do you want to proceed to the payment page?',
            text: "Verify all the details properly. It can't be changed once payment is processed!",
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        });
        if (payment) {
            const input = getInputValue();
            input.routeno = routeno;
            flow(input);
        }
    } else {
        swal('Oh Shit!!', 'All fields are required!', 'error');
    }
}
function validate() {
    const input = getInputValue();
    return (
        input.name &&
        input.type &&
        input.id &&
        input.phno &&
        input.email &&
        input.boardingpt
    );
}
function getInputValue() {
    const input = {
        name: document.getElementsByName("pass[name]")[0].value,
        id: document.getElementsByName("pass[id]")[0].value,
        phno: document.getElementsByName("pass[phno]")[0].value,
        email: document.getElementsByName("pass[email]")[0].value,
        boardingpt: document.getElementsByName("pass[boardingpt]")[0].value,
        type: document.getElementsByName("pass[type]")[0].value,
    };
    return input;
}

async function verifyPayment(response, input) {
    try {
        input.paymentDetails = {};
        input.paymentDetails.orderId = response.razorpay_order_id;
        input.paymentDetails.paymentId = response.razorpay_payment_id;

        const res = await fetch("/payment/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ response }),
        });
        const data = await res.json();

        if (data.signatureIsValid === "true") {
            input.paymentDetails.status = "Paid";
            input.paymentDetails.amt = price[0].price;
            input.paymentDetails.time = Date.now();
            alert("Payment Success");
            await createNewPassenger(input);
            window.location.href = "/success";
        } else {
            alert("Payment Failure");
        }
    } catch (error) {
        console.error(error);
    }
}
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
