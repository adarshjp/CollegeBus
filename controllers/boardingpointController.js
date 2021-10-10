const Boardingpt = require("../models/boardingpt");
exports.newBoardingpoint_get = (req, res) => {
  res.render("newBoardingpoint");
};

exports.newBoardingpoint_post = (req, res) => {
  var bt = req.body.bt;
  console.log(bt);
  Boardingpt.create(bt, (err, newbt) => {
    if (err) console.log(err);
    else {
      console.log(newbt);

      res.redirect("/newBoardingpoint");
    }
  });
};
