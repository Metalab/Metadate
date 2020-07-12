const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  //res.send("Hello World!");
  res.render("input");
});

app.post("/", function (req, res) {
  const body = req.body;
  console.log("New Date!");
  console.log(body.who + " seeks " + body.what);
  console.log(body.longdesc);
  console.log(body.contact);
  res.render("date", {
    who: body.who,
    what: body.what,
    shortdesc: body.shortdesc,
    longdesc: body.longdesc,
    contact: body.contact,
  });
});

app.listen(8088, function () {
  console.log("Example app listening on port 3000!");
});
