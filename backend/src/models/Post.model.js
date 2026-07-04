import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author must be at least 2 characters'],
      maxlength: [100, 'Author must be at most 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Technology', 'Lifestyle', 'Travel', 'Business', 'Health', 'Other'],
        message: 'Category must be one of: Technology, Lifestyle, Travel, Business, Health, Other',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: { values: ['draft', 'published'], message: 'Status must be draft or published' },
      default: 'draft',
    },
    coverImage: {
      type: String,
      default: '',
      validate: {
        validator(v) {
          if (!v) return true;
          try { new URL(v); return true; } catch { return false; }
        },
        message: 'Cover image must be a valid URL',
      },
    },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', author: 'text', category: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
