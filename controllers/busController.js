const Bus=require('../models/bus')
exports.newBus_get = (req, res) => {
  res.render("newBus");
};

exports.newBus_post = (req, res) => {
  var bus = req.body.bus;
  console.log(bus);
  Bus.create(bus, (err, newbus) => {
    if (err) console.log(err);
    else {
      console.log(newbus);
      res.redirect("/newBus");
    }
  });
};
