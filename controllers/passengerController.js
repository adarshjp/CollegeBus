const Bus = require("../models/bus");
const Boardingpt = require("../models/boardingpt");
const Publishable_Key = process.env.Publishable_Key;
const Secret_Key = process.env.Secret_Key;
const stripe = require("stripe")(Secret_Key);
const Passenger=require('../models/passenger')
const nodemailer = require("nodemailer");
global.passenger = {};

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.PASS,
    },
  });
  let mailDetails = {
    from: process.env.EMAIL_ID,
    to: "abc@gmail.com",
    subject: "Bus Pass",
    text: "Congratulations! Your seat has been reserved!!",
  };

exports.home = (req, res) => {
  res.render("home");
};

exports.fee = (req, res) => {
  Boardingpt.find()
    .sort({ routeno: 1 })
    .then((bt) => {
      //console.log(bt)
      res.render("fee", { bt: bt });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.newPassenger = (req, res) => {
  Bus.find({}, { routeno: 1, _id: 0 }, (err, routeno) => {
    if (err) console.log(err);
    else {
      //console.log(routeno)
      Boardingpt.find({}, { id: 0 }, (err, bt) => {
        if (err) console.log(err);
        else {
          //console.log(bt)
          res.render("newPassenger", { routeno: routeno, bt: bt });
        }
      });
    }
  });
};

exports.checkout = (req, res) => {
  global.passenger = req.body.pass;
  Boardingpt.find({ boardingpt: req.body.pass.boardingpt }, (err, price) => {
    if (err) console.log(err);
    else {
      if (req.body.pass.routeno === "null")
        global.passenger.routeno = price[0].routeno;
      Bus.find(
        { routeno: global.passenger.routeno },
        { totalseats: 1, _id: 0 },
        (err, total_seats) => {
          var seat = total_seats[0].totalseats;
          console.log(total_seats);
          if (seat === 0) res.render("seatfull");
          else {
            Boardingpt.find(
              { boardingpt: req.body.pass.boardingpt },
              { _id: 0 },
              (err, price) => {
                if (err) console.log(err);
                else {
                  console.log(price[0]);
                  global.passenger.routeno = price[0].routeno;
                  global.passenger.price = price[0].price;
                  /*ticketprice=passenger.price
                            console.log(typeof(passenger.price))*/
                  console.log(global.passenger);
                  res.redirect("/checkout");
                }
              }
            );
          }
        }
      );
    }
  });
};

exports.checkout_get = (req, res) => {
  res.render("checkout", { passenger: global.passenger, key: Publishable_Key });
};

exports.payment = (req, res) => {
  console.log("Payment route");
  //var ticketprice=passenger.price
  var passenger = req.body.pass;
  console.log(passenger);
  stripe.customers
    .create({
      //email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: req.body.pass.name,
      //address:passenger.boardingpt
    })
    .then((customer) => {
      console.log("Customer");
      return stripe.charges.create({
        amount: req.body.pass.price * 100, // Charing Rs 25
        description: "Bus pass",
        currency: "INR",
        customer: customer.id,
      });
    })
    .then((charge) => {
      console.log("Sucess");
      Passenger.create(passenger, (err, newPass) => {
        if (err) console.log(err);
        else {
          console.log(newPass);
          Bus.find(
            { routeno: req.body.pass.routeno },
            { totalseats: 1, _id: 0 },
            (err, total_seats) => {
              console.log(req.body.pass.routeno);
              console.log(total_seats);
              var seat = total_seats[0].totalseats;
              seat = seat - 1;
              console.log(seat);

              Bus.findOneAndUpdate(
                { routeno: newPass.routeno },
                { totalseats: seat },
                (err, updatedBus) => {
                  console.log(updatedBus);
                }
              );
              console.log(newPass);
              mailDetails.to = req.body.pass.email;
              mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                  console.log("Error Occurs" + err);
                } else {
                  console.log("Email sent successfully");
                }
              });
              res.render("sucess");
            }
          );
        }
      });
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
};
