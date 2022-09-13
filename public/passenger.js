function verifyDetails() {
    if (validate()) {
        swal({
            title: "Do you want to proceed to the payment page?",
            text: "Verfiy all the details properly.It can't be changed once payment is processed!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
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
    return new Promise((resolve, reject) =>{
        fetch("/getPrice", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardingpt }),
        })
        .then((response) => response.json())
        .then((data)=>resolve(data))
        .catch((error)=> reject(error))
    })
}
function getSeats(boardingpt) {
    return new Promise((resolve, reject)=>{
        fetch("/seats", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardingpt }),
        })
        .then((response) => response.json())
        .then((data)=>resolve(data))
        .catch((error)=>reject(error))
    })
}