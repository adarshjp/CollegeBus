const bodyParser = require("body-parser"),
  express = require("express"),
  app = express(),
  mongoose = require("mongoose");
(passport = require("passport")),
  (LocalStrategy = require("passport-local")),
  (psssportLocalMongoose = require("passport-local-mongoose")),
  (nodemailer = require("nodemailer"));
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//MONGODB ATLAS CONNECTION

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.DB_URL2, connectionParams)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("NOT CONNECTED!!");
    console.log(err);
  });
//MONGODB CONNECTION COMPLETED
const Admin = require("./models/admin");
const Boardingpt = require("./models/boardingpt");
const Bus = require("./models/bus");
const Passenger = require("./models/passenger");

const Publishable_Key = process.env.Publishable_Key;
const Secret_Key = process.env.Secret_Key;

const stripe = require("stripe")(Secret_Key);

global.passenger = {};
var ticketprice = 0;

app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/fee", (req, res) => {
  Boardingpt.find()
    .sort({ routeno: 1 })
    .then((bt) => {
      //console.log(bt)
      res.render("fee", { bt: bt });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/newPassenger", (req, res) => {
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
});

/*app.post("/newPassenger",(req,res)=>{
    var passenger=req.body.pass
    //console.log(req.body.pass.boardingpt)
    Boardingpt.find({"boardingpt":req.body.pass.boardingpt},(err,price)=>{
        if(err)
            console.log(err)
        else{
           if(req.body.pass.routeno==='null')
           passenger.routeno=price[0].routeno
           console.log(passenger);
           Bus.find({"routeno":passenger.routeno},{totalseats:1,_id:0},(err,total_seats)=>{
                var seat=total_seats[0].totalseats
                console.log(seat)
                if(seat===0)
                    res.send("Sorry seat is full!!")
                else{
                    Passenger.create(passenger,(err,newPass)=>{
                        if(err)
                            console.log(err)
                        else{
                            seat=seat-1;
                            console.log(seat)
                            Bus.findOneAndUpdate({"routeno":newPass.routeno},{"totalseats":seat},(err,updatedBus)=>{
                                console.log(updatedBus)
                            })
                            console.log(newPass) 
                            mailDetails.to=req.body.pass.email
                            mailTransporter.sendMail(mailDetails, function(err, data) { 
                                if(err) { 
                                    console.log('Error Occurs'+err); 
                                } else { 
                                    console.log('Email sent successfully'); 
                                } 
                            });
                            res.send("Congrtulations !! Your seat is reserved")
                        }
                        
                    })
            }
           })
            
            
        }

  })
})*/

//adding Payment gate way
app.post("/checkout", (req, res) => {
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
});
app.get("/checkout", (req, res) => {
  /*app.use(bodyParser.urlencoded({extended:false})) 
    app.use(bodyParser.json())
    console.log(Publishable_Key)*/
  res.render("checkout", { passenger: global.passenger, key: Publishable_Key });
});
app.post("/payment", (req, res) => {
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
});

//ADD NEW BUS
app.get("/newBus", isLoggedIn, (req, res) => {
  res.render("newBus");
});
app.post("/newBus", isLoggedIn, (req, res) => {
  var bus = req.body.bus;
  console.log(bus);
  Bus.create(bus, (err, newbus) => {
    if (err) console.log(err);
    else {
      console.log(newbus);
      res.redirect("/newBus");
    }
  });
});

//ADD NEW BOARDING PT
app.get("/newBoardingpoint", isLoggedIn, (req, res) => {
  res.render("newBoardingpoint");
});

app.post("/newBoardingpoint", isLoggedIn, (req, res) => {
  var bt = req.body.bt;
  console.log(bt);
  Boardingpt.create(bt, (err, newbt) => {
    if (err) console.log(err);
    else {
      console.log(newbt);

      res.redirect("/newBoardingpoint");
    }
  });
});

app.get("/view", isLoggedIn, (req, res) => {
  Passenger.find({}, (err, pass) => {
    Bus.find({}, (err, bus) => {
      res.render("view", { passenger: pass, bus: bus });
    });
  });
});

app.post("/view", isLoggedIn, (req, res) => {
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
});
app.get("/view/:id", (req, res) => {
  var id = req.params.id;
  Passenger.find({ id: id }, (err, newPass) => {
    console.log(newPass[0]);
    res.render("viewpassenger", { passenger: newPass });
  });
});
app.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin");
});
/*app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser=new Admin({username:req.body.username});
    Admin.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/admin");
        });
    });
});*/
app.get("/login", function (req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/admin");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Started!!");
});
