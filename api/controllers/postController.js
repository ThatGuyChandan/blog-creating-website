const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// Handlers expect req, res, next, and optionally io (from req.app.get('io'))

exports.createPost = (uploadMiddelware) => (req, res, next) => {
  uploadMiddelware.single('file')(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    const fileUrl = req.file ? req.file.location : null;
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const { title, summary, content } = req.body;
        if (!title || !summary || !content) {
          return res.status(400).json({ error: 'All fields are required.' });
        }
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: fileUrl, // will be null if no image
          author: info.id,
        });
        // Populate author for real-time event
        const populatedPost = await Post.findById(postDoc._id).populate('author', ['username']);
        req.app.get('io').emit('new_post', populatedPost);
        res.json({ postDoc });
      } catch (error) {
        console.error('Post creation error:', error);
        res.status(400).json({ error: error.message || 'Failed to create post' });
      }
    });
  });
};

exports.editPost = (uploadMiddelware, deleteS3Image) => async (req, res) => {
  let fileUrl = null;
  if (req.file) {
    fileUrl = req.file.location;
  }
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    // If a new image is uploaded, delete the old one from S3
    if (fileUrl && postDoc.cover && postDoc.cover !== fileUrl) {
      deleteS3Image(postDoc.cover);
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: fileUrl ? fileUrl : postDoc.cover,
    });
    const updatedPost = await Post.findById(id).populate('author', ['username']);
    req.app.get('io').emit('edit_post', updatedPost);
    res.json(postDoc);
  });
};

exports.getPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ total, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
};

exports.deletePost = (deleteS3Image) => async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      if (String(post.author) !== String(info.id)) {
        return res.status(403).json({ error: 'You are not the author' });
      }
      // Delete the image from S3 if it exists
      if (post.cover) {
        deleteS3Image(post.cover);
      }
      await Post.findByIdAndDelete(id);
      req.app.get('io').emit('delete_post', id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Failed to delete post' });
    }
  });
};
