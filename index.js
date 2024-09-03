const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();

const stripe = require("stripe")(
  "sk_test_51MbRAjDzVo2gj2qxncMCv2XggrbDyTXY35x3E2r9tftIw2PAC4t2f3dMoOw9TA3dCCXUWTipxrFZDgyKRjYC69vw00wRRMeTEm"
);

app.use(cors());

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.post("/upload", fileUpload(), async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  //   console.log(convertToBase64(req.files.picture));

  //   console.log(req.headers.authorization);

  try {
    const result = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture)
    );

    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/payment", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 300,
      currency: "eur",
      description: "article vendu",
    });
    res.json(paymentIntent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("🔥 server started 🔥");
});
