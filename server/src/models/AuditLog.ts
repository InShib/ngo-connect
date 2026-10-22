import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  action: string;
  ipAddress?: string;
  details?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
