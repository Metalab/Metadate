const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const numberOfDates = 20;
const baseUrl = "http://localhost";
//const baseUrl = "https://metadate.cool";
const port = 5000;

const defaultPage = {
  who: "Website",
  what: "Date",
  shortdesc:
    "Hackerdate website seeks new dating announce to display on its currently empty kiosk page. To enter your date follow the link below.",
  longdesc: "empty",
  contact: "empty",
  url: baseUrl,
  shortUrl: "/newdate",
  nextpage: 0,
};

let current = -1;
let data = [];

function SanityCheck(input) {
  let errors = [];
  if (input.who.length < 2 || input.who.length > 15) {
    errors.push("Please fill out who is looking for something!");
  }

  if (input.what.length < 2 || input.what.length > 15) {
    errors.push("Please fill out what is beeing looked for!");
  }

  if (input.shortdesc.length < 10 || input.shortdesc.length > 200) {
    errors.push("Please provide a short description of the date!");
  }

  if (input.longdesc.length > 2000) {
    errors.push("Please don't write a book!");
  }

  if (input.contact.length < 5 || input.contact.length > 1000) {
    errors.push("Please enter how someone can contact you!");
  }
  return errors;
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("list", {
    dates: data,
  });
});

app.get("/newdate", function (req, res) {
  res.render("input", {
    errors: [],
    content: {},
  });
});

app.post("/", function (req, res) {
  const body = req.body;
  const errors = SanityCheck(body);
  if (errors.length > 0) {
    res.render("input", {
      errors: errors,
      content: body,
    });
  } else {
    current = (current + 1) % numberOfDates;
    data[current] = {
      who: body.who,
      what: body.what,
      shortdesc: body.shortdesc,
      longdesc: body.longdesc,
      contact: body.contact,
      password: body.password,
      url: `${baseUrl}/date/${current}`,
      shortUrl: `/date/${current}`,
    };

    res.redirect("date/" + current);
  }
});

app.post("/date/:num", function (req, res) {
  if( req.params.num < data.length)
  {
    const date = data[req.params.num];
    if(data[req.params.num].password === req.body.password)
    {
      data.splice(req.params.num,1);
      current -=1;
      res.redirect("/");
    }
    else
    {
    let errors = [];
    errors.push("The password was incorrect!");
    res.render("date", {
      errors: errors,
      who: date.who,
      what: date.what,
      shortdesc: date.shortdesc,
      longdesc: date.longdesc,
      contact: date.contact,
    });

    }
  } else {
    res.status(404).send("Date does not exist");
  }
});

app.get("/date/:num", function (req, res) {
  const body = data[req.params.num];
  if (body) {
    res.render("date", {
      errors: [],
      who: body.who,
      what: body.what,
      shortdesc: body.shortdesc,
      longdesc: body.longdesc,
      contact: body.contact,
    });
  } else {
    res.status(404).send("Date does not exist");
  }
});

app.get("/kiosk", function (req, res) {
  res.render("kiosk");
});

app.get("/kiosk/:num", function (req, res) {
  const num = parseInt(req.params.num);
  const body = data[num];
  if (body) {
    body.nextpage = (num + 1) % data.length;
    res.json(body);
  } else {
    res.json(defaultPage);
  }
});

app.listen(port, function () {
  console.log("Metadate listening on port " + port + "!");
});
