var express = require("express");
var cors = require("cors");
var app = express();
const axios = require("axios");

const PORT = process.env.PORT || 5000;

const URI_RECEIPT = "http://164.52.218.27:7080/wfpredict/ner_sroie";
const URI_FORM = "http://164.52.218.27:7080/wfpredict/ner_funsd";

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", function (req, res, next) {
  res.json({
    msg: "This is CORS-enabled for all origins! Pytorch Hackathon || DET || Middleware",
  });
});

const headers = {
  "Content-Type": "application/json",
};

async function getResult(b64File, type) {
  return await axios.post(
    type === "receipt" ? URI_RECEIPT : URI_FORM,
    {
      b64: b64File.split(",")[1],
    },
    {
      headers,
    }
  );
}

app.post("/predictForm", async (req, res) => {
  const { data } = req.body;
  if (data) {
    const result = await getResult(data, "form");

    res.status(200).json(result.data);
  }
});

app.post("/predictReceipt", async (req, res) => {
  const { data } = req.body;
  if (data) {
    const result = await getResult(data, "receipt");

    res.status(200).json(result.data);
  }
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port 80");
});
