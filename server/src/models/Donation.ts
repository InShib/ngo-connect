import mongoose, { Schema, Document } from 'mongoose';

export type DonationType = 'money' | 'item';
export type ItemCategory = 'food' | 'clothes' | 'books' | 'medical_supplies' | 'furniture' | 'electronics' | 'animal_supplies' | 'other';
export type TrackingStatus = 'scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface IDonationItem {
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair';
}

export interface IDonation extends Document {
  donor: mongoose.Types.ObjectId;
  donorName: string;
  donorEmail: string;
  ngo: mongoose.Types.ObjectId;
  campaign?: mongoose.Types.ObjectId;
  type: DonationType;
  // For Money Donations
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  isAnonymous?: boolean;
  
  // For Item Donations
  items?: IDonationItem[];
  pickupAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  pickupDate?: Date;
  trackingStatus?: TrackingStatus;
  
  // Receipts & Proofs
  receiptNumber: string;
  pdfReceiptUrl?: string;
  qrCodeData?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema(
  {
    donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    ngo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    type: { type: String, enum: ['money', 'item'], required: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, default: 'UPI' },
    transactionId: { type: String, default: '' },
    isAnonymous: { type: Boolean, default: false },
    items: [
      {
        name: { type: String, required: true },
        category: {
          type: String,
          enum: ['food', 'clothes', 'books', 'medical_supplies', 'furniture', 'electronics', 'animal_supplies', 'other'],
          required: true,
        },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'units' },
        condition: { type: String, enum: ['new', 'like_new', 'good', 'fair'], default: 'good' },
      },
    ],
    pickupAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    pickupDate: { type: Date },
    trackingStatus: {
      type: String,
      enum: ['scheduled', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'scheduled',
    },
    receiptNumber: { type: String, required: true, unique: true },
    pdfReceiptUrl: { type: String, default: '' },
    qrCodeData: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IDonation>('Donation', DonationSchema);
