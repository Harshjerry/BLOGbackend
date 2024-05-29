const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require('cors');

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

dotenv.config();

mongoose.connect(process.env.CONN_STR,{
  useNewUrlParser:true}).then((conn)=>{
    // console.log(conn);
    console.log("db connection succesful");
  }).catch((err)=>{
    console.log("errror occured while connection" );
  })


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/", (req, res) => {
  return res.status(200).json(
    {
      success: true,
      message: "Everything fine"
    }
  )
})
app.listen(process.env.PORT, () => {
  console.log("Backend is running.");
});
