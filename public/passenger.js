let price,routeno,input;
window.onload=()=>{
    bt = document.getElementById("boardingpt");
    bt.addEventListener("change", async () => {
        document.getElementById("rzp-button1").disabled = true;
        let boardingpt = bt.value;
        price=await  getPrice(boardingpt)
        let seats=await getSeats(boardingpt)
        console.log(seats);
        routeno=seats.routeno;
        if(seats.totalseats<1){
            swal({
                title: "Oh no!",
                text:"Seat Full!",
                icon:"warning"
            })
            document.getElementById("rzp-button1").value="Seat Full!"
        }else{
            document.getElementById("rzp-button1").disabled = false;
            document.getElementById("rzp-button1").value='Pay ₹'+price[0].price
        }
    });
}
function verifyDetails() {
    if (validate()) {
        swal({
            title: "Do you want to proceed to the payment page?",
            text: "Verfiy all the details properly.It can't be changed once payment is processed!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((payment) => {
                if (payment) {
                    // rzp1.open();
                    // e.preventDefault();
                    input=getInputValue();
                    flow();
                }
            })
    } else {
        swal("Oh Shit!!", "All fields are required!", "error");
    }
}
function validate() {
    let input = getInputValue();
    if (
        !input.name ||
        !input.type ||
        !input.id ||
        !input.phno ||
        !input.email ||
        !input.boardingpt
    ) {
        return false;
    }
    return true;
}
function getInputValue() {
    let input = {
        name: document.getElementsByName("pass[name]")[0].value,
        id: document.getElementsByName("pass[id]")[0].value,
        phno: document.getElementsByName("pass[phno]")[0].value,
        email: document.getElementsByName("pass[email]")[0].value,
        boardingpt: document.getElementsByName("pass[boardingpt]")[0].value,
        type: document.getElementsByName("pass[type]")[0].value,
    };
    return input;
}
function getPrice(boardingpt) {
    return new Promise((resolve, reject) => {
        fetch("/getPrice", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardingpt }),
        })
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error))
    })
}
function getSeats(boardingpt) {
    return new Promise((resolve, reject) => {
        fetch("/seats", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardingpt }),
        })
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error))
    })
}

async function flow() {
    let orderId = await getOrderId();
    let input=getInputValue();
    var options = {
        key: "rzp_test_UKDlaMQmjNXpas", // Enter the Key ID generated from the Dashboard
        amount: price[0].price*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Nitte Education Trust",
        description: "Bus pass fee payment",
        image: "https://yt3.ggpht.com/ytc/AMLnZu-3U3Uuy2liuzEkuUvszFTwyh8k3Es3x7Ei3JBXaA=s900-c-k-c0x00ffffff-no-rj",
        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: verifyPayment,
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
    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    //e.preventDefault();
    // document.getElementById("rzp-button1").onclick = function (e) {
    //     rzp1.open();
    //     e.preventDefault();
    // };
}
//flow();
//console.log(orderId);
async function getOrderId() {
    console.log(price)
    return new Promise((resolve, reject) => {
        fetch("/payment/create/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: price[0].price*100,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                resolve(data.order.id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
async function verifyPayment(response) {
    //console.log(response)
    return new Promise((resolve, reject) => {
        fetch("/payment/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ response }),
        })
            .then((response) => response.json())
            .then(async (data) => {
                if (data.signatureIsValid === 'true') {
                    alert("Payment Sucess");
                    input.routeno=routeno;
                    console.log('CLENT->SERVER',input);
                    await createNewPassenger(input)
                    console.log("New Passenger Created Successfully");
                    window.location.href="/success";
                } else {
                    alert("Payment Failure");
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}
async function createNewPassenger(passenger) {
    return new Promise((resolve, reject) => {
        fetch("/newPassenger",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ passenger })
        })
        .then((response)=>response.json())
        .then((data)=>resolve(data))
        .catch((err)=>reject(err))
    })
}