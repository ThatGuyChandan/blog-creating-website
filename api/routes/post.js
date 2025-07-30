const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const uploadMiddelware = require('../middleware/upload');
const { deleteS3Image } = require('../utils/s3');

// Create post
router.post('/', postController.createPost(uploadMiddelware));
// Edit post
router.put('/', uploadMiddelware.single('file'), postController.editPost(uploadMiddelware, deleteS3Image));
// Get paginated posts
router.get('/', postController.getPosts);
// Get post by ID
router.get('/:id', postController.getPostById);
// Delete post
router.delete('/:id', postController.deletePost(deleteS3Image));

module.exports = router;
