import { Router } from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  exportCSV,
} from '../controllers/post.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/search', searchPosts);
router.get('/export', exportCSV);

router.route('/')
  .get(getPosts)
  .post(createPost);

router.route('/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost);

export default router;
