import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
  }
})

const Blog = mongoose.model("blogs", blogSchema)

export default Blog
