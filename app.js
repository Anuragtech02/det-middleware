var express = require("express");
var cors = require("cors");
var app = express();
const axios = require("axios");
var FormData = require("form-data");
var fs = require("fs");
var { Blob } = require("buffer");

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

const dataURLToFile = async (dataurl, name) => {
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = dataurl.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = Buffer.from(data, "base64");
  await fs.writeFileSync(name + "." + ext, buffer);
  return ext;
};

function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

async function getResult(b64File) {
  const headers = {
    // Accept: "application/json",
    "Content-Type": "application/json",
    // "Content-Security-Policy": "upgrade-insecure-requests",
  };
  // const formData = new FormData();
  // const file = DataURIToBlob(b64File, "temp-image");
  // //   console.log(file);
  // // const file = fs.createReadStream("/temp-image." + ext);
  // console.log(file);
  // formData.append("data", file);
  return await axios.post(
    "http://164.52.218.27:7080/wfpredict/ocr",
    b64File.split(",")[1],
    {
      headers,
    }
  );
}

app.post("/predict", async (req, res) => {
  const { data } = req.body;
  // console.log(req.body);
  // if (data) {
  // console.log("Found");
  const result = await getResult(data);

  res.status(200).json(result.data);
  // }
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port 80");
});
