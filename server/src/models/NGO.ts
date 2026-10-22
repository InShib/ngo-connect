import mongoose, { Schema, Document } from 'mongoose';

export type NGOStatus = 'pending' | 'verified' | 'rejected';

export interface INGO extends Document {
  user: mongoose.Types.ObjectId;
  organizationName: string;
  registrationNumber: string;
  registrationCertificate?: string;
  logo?: string;
  banner?: string;
  mission: string;
  vision: string;
  description: string;
  verificationStatus: NGOStatus;
  verificationReason?: string;
  workingAreas: string[];
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location?: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  impactMetrics: {
    livesImpacted: number;
    campaignsCompleted: number;
    totalFundsRaised: number;
    volunteersEngaged: number;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    upiId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NGOSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organizationName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    registrationCertificate: { type: String, default: '' },
    logo: { type: String, default: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=300&q=80' },
    banner: { type: String, default: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80' },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    description: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationReason: { type: String, default: '' },
    workingAreas: [{ type: String }],
    website: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [77.2090, 28.6139] }, // Default Delhi coords
    },
    impactMetrics: {
      livesImpacted: { type: Number, default: 0 },
      campaignsCompleted: { type: Number, default: 0 },
      totalFundsRaised: { type: Number, default: 0 },
      volunteersEngaged: { type: Number, default: 0 },
    },
    bankDetails: {
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      bankName: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      upiId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

NGOSchema.index({ location: '2dsphere' });

export default mongoose.model<INGO>('NGO', NGOSchema);
