var express = require("express");
var cors = require("cors");
var app = express();
const axios = require("axios");

const PORT = process.env.PORT || 5000;

app.use(cors());
// app.options("*", cors()); // include before other routes
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
// app.use(upload.array());

app.get("/", function (req, res, next) {
  res.json({
    msg: "This is CORS-enabled for all origins! Pytorch Hackathon || DET || Middleware",
  });
});

async function getResultForm(b64File) {
  const headers = {
    "Content-Type": "application/json",
  };
  return await axios.post(
    "http://164.52.218.27:8000/wfpredict/ocr",
    b64File.split(",")[1],
    {
      headers,
    }
  );
}

async function getResultReceipt(b64File) {
  const headers = {
    "Content-Type": "application/json",
  };
  return await axios.post(
    "http://164.52.218.27:7080/wfpredict/ocr",
    b64File.split(",")[1],
    {
      headers,
    }
  );
}

app.post("/predictForm", async (req, res) => {
  const { data } = req.body;
  if (data) {
    const result = await getResultForm(data);

    res.status(200).json(result.data);
  }
});

app.post("/predictReceipt", async (req, res) => {
  const { data } = req.body;
  if (data) {
    const result = await getResultReceipt(data);

    res.status(200).json(result.data);
  }
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port 80");
});
