const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  content: String,
});

// Create a mongoose model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// API endpoint to get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to create a new blog post
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new BlogPost({ title, content });
    await newPost.save();
    res.json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
