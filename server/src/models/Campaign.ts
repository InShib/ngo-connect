import mongoose, { Schema, Document } from 'mongoose';

export type CampaignCategory =
  | 'education'
  | 'healthcare'
  | 'food_hunger'
  | 'disaster_relief'
  | 'environment'
  | 'animal_welfare'
  | 'women_empowerment'
  | 'elderly_care';

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface ICampaignUpdate {
  title: string;
  content: string;
  createdAt: Date;
}

export interface ICampaignComment {
  user: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  comment: string;
  createdAt: Date;
}

export interface ICampaign extends Document {
  ngo: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: CampaignCategory;
  targetAmount: number;
  raisedAmount: number;
  volunteerNeededCount: number;
  volunteerRegisteredCount: number;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  isFeatured: boolean;
  isUrgent: boolean;
  images: string[];
  bannerImage: string;
  updates: ICampaignUpdate[];
  comments: ICampaignComment[];
  bookmarksCount: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    ngo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'education',
        'healthcare',
        'food_hunger',
        'disaster_relief',
        'environment',
        'animal_welfare',
        'women_empowerment',
        'elderly_care',
      ],
      required: true,
    },
    targetAmount: { type: Number, required: true, min: 0 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    volunteerNeededCount: { type: Number, default: 0 },
    volunteerRegisteredCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    isFeatured: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    images: [{ type: String }],
    bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80' },
    updates: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        userAvatar: { type: String },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    bookmarksCount: { type: Number, default: 0 },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
