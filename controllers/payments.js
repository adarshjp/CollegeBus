Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({

    // Replace with your key_id
    key_id: process.env.RKEY,

    // Replace with your key_secret
    key_secret: process.env.RSECRET,
});
exports.createOrder = (req, res) => {
    const { amount, currency, receipt, notes } = req.body;
    //console.log(req.body)
    // STEP 2:	
    razorpayInstance.orders.create({ amount },
        (err, order) => {

            //STEP 3 & 4:
            //console.log(order)
            if (!err)
                res.json({ order })
            else
                res.send(err);
        }
    )
}
exports.verify = (req, res) => {
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'JkyUqEPxrPf6zegl125gGA7Z')
        .update(body.toString())
        .digest('hex');
    //console.log("sig received ", req.body.response.razorpay_signature);
    //console.log("sig generated ", expectedSignature);
    var response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.response.razorpay_signature)
        response = { "signatureIsValid": "true" }
    res.send(response);
}