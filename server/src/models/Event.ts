import mongoose, { Schema, Document } from 'mongoose';

export type EventCategory =
  | 'blood_donation'
  | 'tree_plantation'
  | 'food_distribution'
  | 'medical_camp'
  | 'education_drive'
  | 'fundraising'
  | 'cleaning_campaign'
  | 'animal_welfare'
  | 'women_empowerment';

export interface IAttendee {
  user: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  status: 'registered' | 'attended' | 'absent';
  checkInTime?: Date;
  certificateGenerated?: boolean;
}

export interface IEvent extends Document {
  ngo: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: EventCategory;
  bannerImage: string;
  location: {
    venue: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: [number, number];
  };
  eventDate: Date;
  startTime: string;
  endTime: string;
  volunteersRequired: number;
  qrCheckInCode: string;
  attendees: IAttendee[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    ngo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'blood_donation',
        'tree_plantation',
        'food_distribution',
        'medical_camp',
        'education_drive',
        'fundraising',
        'cleaning_campaign',
        'animal_welfare',
        'women_empowerment',
      ],
      required: true,
    },
    bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80' },
    location: {
      venue: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: { type: [Number], default: [77.2090, 28.6139] },
    },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    volunteersRequired: { type: Number, default: 10 },
    qrCheckInCode: { type: String, required: true },
    attendees: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        status: { type: String, enum: ['registered', 'attended', 'absent'], default: 'registered' },
        checkInTime: { type: Date },
        certificateGenerated: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
