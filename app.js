var express = require("express");
var cors = require("cors");
var app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port 80");
});
