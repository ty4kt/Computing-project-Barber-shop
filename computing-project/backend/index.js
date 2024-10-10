require("dotenv").config();
console.log(process.env.JWT_SECRET);
const cors = require("cors");
const express = require("express");
const db = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const cloudinary = require("./config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const app = express();
const port = 7585;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "demo",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
  },
});

const upload = multer({ storage: storage });

const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

const allowedOrigins = ["http://localhost:3000", "192.168.1.100:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("layout", "partials/layout");

app.use("/", mainRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
