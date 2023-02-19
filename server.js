const express = require("express");
const { json } = require("express/lib/response");
const app = express();
app.set("view engine", "ejs");

const { MongoClient, ServerApiVersion } = require("mongodb");

var session = require("express-session");
app.use(express.static("./public"));

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
});

app.use(
  session({
    secret: "ssshhhhh",
    saveUninitialized: true,
    resave: true,
  })
);

function auth(req, res, next) {
  console.log("auth function works");
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
}

const https = require("https");

app.get("/profile/:id", function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  data = "";
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
      data = JSON.parse(data);

      hp = data.stats
        .filter((obj) => {
          return obj.stat.name == "hp";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      console.log(hp);
      res.render("profile.ejs", {
        id: req.params.id,
        name: data.name,
        type: data.types[0].type.name,
        hp: hp,
        height: data.height,
        weight: data.weight,
      });
    });
  });
});

const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

const mongoose = require("mongoose");
const { stringify } = require("querystring");

mongoose.connect(
  "mongodb+srv://changwhi:102030@cluster0.h59cv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const usersSchema = new mongoose.Schema({
  admin: String,
  user_id: String,
  user_password: String,
  result: String,
  pokeID: Number,
  quantity: Number,
  price: Number,
  username: String,
  password: String,
  text: String,
  hits: Number,
  time: String,
});
const timelineSchema = new mongoose.Schema({
  username: String,
  text: String,
  hits: Number,
  time: String,
});

const pre_checkout = mongoose.model("checkouts", usersSchema); //timelineSchema 가 뭐냐 상수였음

const shoppings = mongoose.model("shoppings", usersSchema); //timelineSchema 가 뭐냐 상수였음

const users = mongoose.model("users", usersSchema); //timelineSchema 가 뭐냐 상수였음

const timelines = mongoose.model("timelines", timelineSchema); //timelineSchema 가 뭐냐 상수였음

app.get("/timelines/getallevents", auth, function (req, res) {
  timelines.find(
    {
      username: req.session.user,
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send(timelines);
    }
  );
});

app.put("/timelines/insert", auth, function (req, res) {
  timelines.create(
    {
      username: req.session.user,
      text: req.body.text,
      time: req.body.time,
      hits: req.body.hits,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Insertion is successful!");
    }
  );
});

app.get("/timelines/delete/:id", function (req, res) {
  timelines.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send("Delete req is successful");
    }
  );
});

app.get("/timelines/increasehits/:id", function (req, res) {
  timelines.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: {
        hits: 1,
      },
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send("Update req is successful");
    }
  );
});

app.get("/shoppingcart", auth, function (req, res) {
  shoppings.find(
    {
      username: req.session.user,
      result: "nocheckout",
    },
    function (err, result) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + result);
      }
      res.send(result);
    }
  );
});

app.get("/shoppingcart/delete/:id", auth, function (req, res) {
  shoppings.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data");
      }
      res.send("Delete req is successful");
    }
  );
});

app.get("/shoppingcart/predelete/:id", auth, function (req, res) {
  shoppings.deleteOne(
    {
      _id: req.params.id,
      result: "checkout",
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data");
      }
      res.send("Delete req is successful");
    }
  );
});

app.get("/shoppingcart/insert/:id/:price", auth, function (req, res) {
  shoppings.create(
    {
      username: req.session.user,
      pokeID: req.params.id,
      price: req.params.price,
      quantity: 1,
      result: "nocheckout",
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Insertion is successful!");
    }
  );
});

app.post("/shoppingcart/checkout", auth, function (req, res) {
  shoppings.updateMany(
    {
      username: req.session.user,
    },
    {
      result: "checkout",
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Insertion is successful!");
    }
  );
});

app.get("/shoppingcart/callpre", auth, function (req, res) {
  shoppings.find(
    {
      username: req.session.user,
      result: "checkout",
    },
    function (err, result) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + result);
      }
      res.send(result);
    }
  );
});

app.post("/shoppingcart/increasehits/:id", function (req, res) {
  shoppings.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: {
        quantity: 1,
      },
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send("Quantity + 1 success");
    }
  );
});

app.post("/shoppingcart/decreasehits/:id", function (req, res) {
  shoppings.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: {
        quantity: -1,
      },
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send("Quantity + 1 success");
    }
  );
});

app.get("/check/admin", auth, function (req, res) {
  users.find(
    {
      username: req.session.user,
    },
    function (err, result) {
      res.send(result[0].admin);
    }
  );
});

app.get("/check", auth, function (req, res) {
  users.find(
    {
      username: req.session.user,
    },
    function (err, result) {
      res.send(result);
    }
  );
});

app.get("/login", function (req, res, next) {
  res.send("fail_auth");
});

app.put("/login/try", function (req, res, next) {
  users.find(
    {
      username: req.body.user_id,
    },
    function (err, result) {
      if (result[0].password == req.body.user_password) {
        if (result[0].admin == "yes") {
          req.session.authenticated = true;
          req.session.user = req.body.user_id;
          req.session.admin = true;
          res.send("Admin Login!");
        } else {
          req.session.authenticated = true;
          req.session.user = req.body.user_id;
          res.send("Successful Login!");
        }
      } else {
        req.session.authenticated = false;
        req.session.admin = false;
        res.send("Failed Login!");
      }
    }
  );
});

app.get("/loginout/", auth, function (req, res, next) {
  req.session.authenticated = false;
  res.status(100).send("Logged out!");
});

app.get("/user", auth, function (req, res, next) {
  users.find({}, function (err, result) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + result);
    }
    res.send(result);
  });
});

app.get("/user/:id", auth, function (req, res) {
  users.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data");
      }
      res.send("Delete req is successful");
    }
  );
});

app.put("/user/insert", auth, function (req, res, next) {
  users.create(
    {
      username: req.body.userID,
      password: req.body.password,
      admin: req.body.admin,
      time: req.body.time,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("User created!");
    }
  );
});

app.put("/user/changeInfo/:id", auth, function (req, res, next) {
  users.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        password: req.body.newpassword,
      },
    },
    function (err, timelines) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + timelines);
      }
      res.send("Update password");
    }
  );
});
