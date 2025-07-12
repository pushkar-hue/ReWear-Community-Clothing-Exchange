import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  profileImage?: string;
  pointsBalance: number;
  sustainabilityScore: number;
  ecoLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSwaps: number;
  totalItemsListed: number;
  carbonSaved: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  profileImage: {
    type: String,
    default: null,
  },
  pointsBalance: {
    type: Number,
    default: 100,
  },
  sustainabilityScore: {
    type: Number,
    default: 0,
  },
  ecoLevel: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze',
  },
  totalSwaps: {
    type: Number,
    default: 0,
  },
  totalItemsListed: {
    type: Number,
    default: 0,
  },
  carbonSaved: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
