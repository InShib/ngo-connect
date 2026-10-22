import mongoose, { Schema, Document } from 'mongoose';

export type RequestCategory = 'food' | 'medicine' | 'clothing' | 'educational_support' | 'scholarships' | 'shelter' | 'emergency';
export type RequestUrgency = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'pending' | 'under_review' | 'approved' | 'fulfilled' | 'rejected';

export interface IBeneficiaryRequest extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  category: RequestCategory;
  urgency: RequestUrgency;
  title: string;
  description: string;
  documents?: string[];
  assignedNgo?: mongoose.Types.ObjectId;
  status: RequestStatus;
  reviewNotes?: string;
  fulfilledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BeneficiaryRequestSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    category: {
      type: String,
      enum: ['food', 'medicine', 'clothing', 'educational_support', 'scholarships', 'shelter', 'emergency'],
      required: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    documents: [{ type: String }],
    assignedNgo: { type: Schema.Types.ObjectId, ref: 'NGO' },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'fulfilled', 'rejected'],
      default: 'pending',
    },
    reviewNotes: { type: String, default: '' },
    fulfilledDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IBeneficiaryRequest>('BeneficiaryRequest', BeneficiaryRequestSchema);
