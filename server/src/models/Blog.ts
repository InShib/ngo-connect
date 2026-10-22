import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  category: 'success_story' | 'awareness' | 'ngo_news' | 'event_highlight';
  authorName: string;
  authorRole: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      enum: ['success_story', 'awareness', 'ngo_news', 'event_highlight'],
      default: 'success_story',
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'Community Contributor' },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, default: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1200&q=80' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
