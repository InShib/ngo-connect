import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  user: mongoose.Types.ObjectId;
  skills: string[];
  languages: string[];
  availability: 'weekdays' | 'weekends' | 'flexible' | 'emergency_only';
  totalHoursWorked: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Hero';
  achievements: string[];
  completedEventsCount: number;
  certificates: {
    title: string;
    issuedBy: string;
    issueDate: Date;
    certificateUrl: string;
    verificationHash: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [{ type: String }],
    languages: [{ type: String }],
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'flexible', 'emergency_only'],
      default: 'flexible',
    },
    totalHoursWorked: { type: Number, default: 0 },
    badgeLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Hero'],
      default: 'Bronze',
    },
    achievements: [{ type: String }],
    completedEventsCount: { type: Number, default: 0 },
    certificates: [
      {
        title: { type: String, required: true },
        issuedBy: { type: String, required: true },
        issueDate: { type: Date, default: Date.now },
        certificateUrl: { type: String, required: true },
        verificationHash: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
