import {flow} from "./flow.js"
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
