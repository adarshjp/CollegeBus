const Passenger = require("../models/passenger");
const Bus = require("../models/bus");

exports.home = (req, res) => {
  res.render("admin");
};

exports.viewOne = (req, res) => {
  var id = req.params.id;
  Passenger.find({ id: id }, (err, newPass) => {
    console.log(newPass[0]);
    res.render("viewpassenger", { passenger: newPass });
  });
};

exports.viewGet = (req, res) => {
  Passenger.find({}, (err, pass) => {
    Bus.find({}, (err, bus) => {
      res.render("view", { passenger: pass, bus: bus });
    });
  });
};

exports.viewPost = (req, res) => {
  var busno = req.body.routeno;
  if (busno === "all") {
    Passenger.find({}, (err, pass) => {
      Bus.find({}, (err, bus) => {
        res.render("view", { passenger: pass, bus: bus });
      });
    });
  } else {
    Passenger.find({ routeno: busno }, (err, pass) => {
      Bus.find({}, (err, bus) => {
        res.render("view", { passenger: pass, bus: bus });
      });
    });
  }
};
