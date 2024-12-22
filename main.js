import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import router from "./routes/blogs.js"
import authRouter from "./routes/user.js"
import session from "express-session";
import cookie from "cookie-parser"
const __dirname = path.resolve();
const app = express();
app.use(cookie())
app.use(express.static(path.join(__dirname, "dist")))
import ConnectToDb from "./middle/connect.js"
// Enable CORS
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
app.use(cors({
  origin: "https://techinwords.tech",
  credentials: true
}));
ConnectToDb()
// Middleware to handle JSON requests
app.use(express.json());
app.use("/blog", router)
app.use("/api/auth", authRouter)
app.get("/*", (req, res) =>{
  res.sendFile(path.join(__dirname,"dist", "index.html"))
})
// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
