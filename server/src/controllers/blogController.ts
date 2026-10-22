import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { AuthRequest } from '../middleware/auth';

// @desc Get Published Blog Articles
// @route GET /api/v1/blogs
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let query: any = { isPublished: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [search] } },
      ];
    }

    const blogs = await Blog.find(query).sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Single Blog Post
// @route GET /api/v1/blogs/:slug
export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create Blog Article (Admin / NGO)
// @route POST /api/v1/blogs
export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, content, excerpt, coverImage, tags } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const blog = await Blog.create({
      title,
      slug,
      category,
      authorName: req.user?.name || 'NGO CONNECT Editorial Team',
      authorRole: req.user?.role === 'ngo' ? 'Partner NGO' : 'Editor',
      content,
      excerpt,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1200&q=80',
      tags: tags || ['SocialImpact', 'Technology'],
      isPublished: true,
    });

    res.status(201).json({ success: true, data: blog, message: 'Article published successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
