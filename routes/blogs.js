import express from "express";
import  Blog from "../models/blogs.js";
const router = express.Router();
import upload from "../middle/upload.js"
import { Redis } from '@upstash/redis'
import {verifyToken, verifyAdmin} from "../jwt/jwt.js";
router.post("/upload", verifyAdmin, upload.single("cover"),async (req, res)=>{
  if(!req.file) return res.status(400).send("No file Uploaded")
  const cover = req.file.path;
  const blog = new Blog({
    Title: req.body.Title,
    description: req.body.description,
    cover: cover,
    createdAt: Date.now(),
  })
  await blog.save()
  res.status(200).send("Blog Uploaded")
})

//normal photo upload
router.post("/UploadImg", verifyAdmin, upload.single("img"), async (req, res)=>{
  if(!req.file) return res.status(400).send("No file Uploaded")
  const img = req.file.path;
  res.json({url: img})
})

//Get all blogs
router.get("/allBlogs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults: page 1, 10 blogs per page
  try {
    const AllBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return res.status(200).json(AllBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//Get one blog
router.get("/blog/:id", async (req, res)=>{
  try {
    
    const BlogData = await Blog.findById(req.params.id);

    if(!Blog) return res.status(404).json({message: "Blog not found"})
    res.json(BlogData)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})
//delete blog
router.delete("/delete/:id", verifyAdmin, async(req, res)=>{
  try {
    const BlogData = await Blog.findById(req.params.id)
    if(!BlogData) return res.status(404).json({message: "Blog not Found"})
  // delete the blog
    await Blog.findByIdAndDelete(req.params.id)
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"})
  }
})
export default router
