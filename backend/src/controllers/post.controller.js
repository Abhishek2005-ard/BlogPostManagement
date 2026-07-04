import Post from '../models/Post.model.js';
import { Parser } from 'json2csv';

const buildFilter = ({ search, category, author, status }) => {
  const filter = {};
  if (category) filter.category = category;
  if (author)   filter.author   = new RegExp(author,   'i');
  if (status)   filter.status   = status;
  if (search)   filter.title    = new RegExp(search,   'i');
  return filter;
};

export const getPosts = async (req, res, next) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(100, parseInt(req.query.limit) || 10);
    const skip   = (page - 1) * limit;
    const filter = buildFilter(req.query);

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) { next(err); }
};

export const searchPosts = async (req, res, next) => {
  try {
    const { q = '', category, status } = req.query;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (q) {
      filter.$or = [
        { title:    new RegExp(q, 'i') },
        { author:   new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

export const exportCSV = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const posts  = await Post.find(filter).sort({ createdAt: -1 }).lean();

    const fields = ['_id', 'title', 'author', 'category', 'status', 'tags', 'coverImage', 'createdAt', 'updatedAt'];
    const opts   = { fields };
    const parser = new Parser(opts);
    const csv    = parser.parse(posts.map(p => ({ ...p, tags: p.tags.join(', ') })));

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="posts.csv"');
    res.send(csv);
  } catch (err) { next(err); }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, author, category, tags, status, coverImage } = req.body;
    const parsedTags = Array.isArray(tags)
      ? tags
      : (tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const post = await Post.create({ title, content, author, category, tags: parsedTags, status, coverImage });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content, author, category, tags, status, coverImage } = req.body;
    const parsedTags = Array.isArray(tags)
      ? tags
      : (tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, category, tags: parsedTags, status, coverImage },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
