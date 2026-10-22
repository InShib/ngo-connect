import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  ngo: mongoose.Types.ObjectId;
  itemName: string;
  category: 'food' | 'clothes' | 'books' | 'medical_supplies' | 'furniture' | 'electronics' | 'school_supplies' | 'other';
  quantity: number;
  unit: string;
  location: string;
  lowStockAlert: number;
  expiryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema: Schema = new Schema(
  {
    ngo: { type: Schema.Types.ObjectId, ref: 'NGO', required: true },
    itemName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['food', 'clothes', 'books', 'medical_supplies', 'furniture', 'electronics', 'school_supplies', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'units' },
    location: { type: String, default: 'Main Warehouse' },
    lowStockAlert: { type: Number, default: 10 },
    expiryDate: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>('Inventory', InventorySchema);
