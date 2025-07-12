import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  tags: string[];
  images: string[];
  arStyledImage?: string; // Generated AR/styled version
  pointsValue: number;
  status: 'pending' | 'active' | 'swapped' | 'removed';
  views: number;
  likes: number;
  estimatedCarbonSaving: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear', 'formal'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true,
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    required: true,
  }],
  arStyledImage: {
    type: String,
    default: null,
  },
  pointsValue: {
    type: Number,
    required: true,
    min: [10, 'Minimum points value is 10'],
    max: [500, 'Maximum points value is 500'],
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'swapped', 'removed'],
    default: 'pending',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  estimatedCarbonSaving: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate points value based on condition and category
ItemSchema.pre('save', function(this: IItem, next) {
  if (!this.pointsValue) {
    let basePoints = 50;
    
    // Adjust based on condition
    switch (this.condition) {
      case 'New': basePoints = 100; break;
      case 'Like New': basePoints = 80; break;
      case 'Good': basePoints = 60; break;
      case 'Fair': basePoints = 40; break;
    }
    
    // Adjust based on category
    if (['outerwear', 'dresses', 'formal'].includes(this.category)) {
      basePoints *= 1.2;
    }
    
    this.pointsValue = Math.round(basePoints);
  }
  
  // Calculate estimated carbon saving (rough estimate)
  if (!this.estimatedCarbonSaving) {
    const categoryMultiplier = {
      'tops': 2.1,
      'bottoms': 2.5,
      'dresses': 3.2,
      'outerwear': 4.5,
      'shoes': 3.8,
      'accessories': 1.2,
      'activewear': 2.8,
      'formal': 4.0,
    };
    
    this.estimatedCarbonSaving = categoryMultiplier[this.category as keyof typeof categoryMultiplier] || 2.0;
  }
  
  next();
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
