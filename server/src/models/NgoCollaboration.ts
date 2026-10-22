import mongoose, { Schema, Document } from 'mongoose';

export type CollaborationType = 'surplus_inventory_transfer' | 'volunteer_exchange' | 'joint_event' | 'joint_campaign' | 'shared_logistics';
export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface INgoCollaboration extends Document {
  requestingNgo: mongoose.Types.ObjectId;
  targetNgo: mongoose.Types.ObjectId;
  type: CollaborationType;
  title: string;
  details: string;
  itemsRequested?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: CollaborationStatus;
  responseNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NgoCollaborationSchema: Schema = new Schema(
  {
    requestingNgo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    targetNgo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    type: {
      type: String,
      enum: ['surplus_inventory_transfer', 'volunteer_exchange', 'joint_event', 'joint_campaign', 'shared_logistics'],
      required: true,
    },
    title: { type: String, required: true },
    details: { type: String, required: true },
    itemsRequested: [
      {
        name: { type: String },
        quantity: { type: Number },
        unit: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    responseNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<INgoCollaboration>('NgoCollaboration', NgoCollaborationSchema);
