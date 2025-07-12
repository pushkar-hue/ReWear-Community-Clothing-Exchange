import mongoose, { Document, Schema } from 'mongoose';

export interface ISwap extends Document {
  _id: string;
  requesterId: string;
  ownerId: string;
  requestedItemId: string;
  offeredItemId?: string;
  swapType: 'direct' | 'points';
  pointsUsed?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SwapSchema: Schema = new Schema({
  requesterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  offeredItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  },
  swapType: {
    type: String,
    enum: ['direct', 'points'],
    required: true,
  },
  pointsUsed: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Validate swap logic
SwapSchema.pre('save', function(this: ISwap, next) {
  if (this.swapType === 'direct' && !this.offeredItemId) {
    return next(new Error('Direct swaps require an offered item'));
  }
  
  if (this.swapType === 'points' && !this.pointsUsed) {
    return next(new Error('Points swaps require points amount'));
  }
  
  if (this.requesterId.toString() === this.ownerId.toString()) {
    return next(new Error('Cannot swap with yourself'));
  }
  
  next();
});

export default mongoose.models.Swap || mongoose.model<ISwap>('Swap', SwapSchema);
