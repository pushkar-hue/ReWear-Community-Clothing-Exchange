import mongoose, { Document, Schema } from 'mongoose';

// Comprehensive Swap Interface for Real-World Tracking
export interface ISwap extends Document {
  _id: string;
  swapId: string;
  
  // Participants
  requester: {
    userId: string;
    username: string;
    item: {
      itemId: string;
      title: string;
      images: string[];
      estimatedValue: number;
      carbonSaving: number;
    }
  };
  
  provider: {
    userId: string;
    username: string;
    item: {
      itemId: string;
      title: string;
      images: string[];
      estimatedValue: number;
      carbonSaving: number;
    }
  };

  // Enhanced status for real-world tracking
  status: 'pending' | 'accepted' | 'declined' | 'method_selected' | 'items_prepared' | 
          'in_transit' | 'delivered' | 'confirmed' | 'completed' | 'disputed' | 'cancelled';

  // Real-World Exchange Management
  exchangeMethod: {
    type: 'in_person' | 'postal' | 'drop_off_point' | 'escrow_service';
    details: {
      meetupLocation?: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number; }
      };
      scheduledTime?: Date;
      shippingDetails?: {
        requesterAddress: any;
        providerAddress: any;
        trackingNumbers: {
          requesterToProvider?: string;
          providerToRequester?: string;
        };
        shippingService: string;
        estimatedDelivery: {
          requesterItem?: Date;
          providerItem?: Date;
        };
      };
      dropOffPoint?: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number; }
        operatingHours: string;
        contactInfo: string;
      };
    }
  };

  // Real-World Verification System
  verification: {
    requesterConfirmations: {
      itemPrepared: { confirmed: boolean; timestamp?: Date; };
      itemSent: { confirmed: boolean; timestamp?: Date; proof?: string; };
      itemReceived: { confirmed: boolean; timestamp?: Date; condition?: string; };
      satisfactionRating?: number;
    };
    providerConfirmations: {
      itemPrepared: { confirmed: boolean; timestamp?: Date; };
      itemSent: { confirmed: boolean; timestamp?: Date; proof?: string; };
      itemReceived: { confirmed: boolean; timestamp?: Date; condition?: string; };
      satisfactionRating?: number;
    };
    photos: {
      beforeShipping: {
        requesterItem: string[];
        providerItem: string[];
      };
      afterReceiving: {
        requesterItem: string[];
        providerItem: string[];
      };
    };
  };

  // Points and environmental impact
  pointsCalculation: {
    totalPoints: {
      requester: number;
      provider: number;
    };
    pointsAwarded: boolean;
  };

  environmentalImpact: {
    totalCarbonSaved: number;
    waterSaved: number;
    wasteReduced: number;
  };

  timeline: Array<{
    event: string;
    timestamp: Date;
    performedBy: string;
    details: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
  progressPercentage: number;
}

// Comprehensive Swap Management Schema
const SwapSchema: Schema = new Schema({
  // Unique swap identifier
  swapId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `SW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  
  // Participants
  requester: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    item: {
      itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
      title: { type: String, required: true },
      images: [String],
      estimatedValue: { type: Number, required: true },
      carbonSaving: { type: Number, required: true },
    }
  },
  
  provider: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    item: {
      itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
      title: { type: String, required: true },
      images: [String],
      estimatedValue: { type: Number, required: true },
      carbonSaving: { type: Number, required: true },
    }
  },

  // Enhanced status management for real-world tracking
  status: {
    type: String,
    enum: [
      'pending',           // Initial request sent
      'accepted',          // Provider accepted the swap
      'declined',          // Provider declined
      'method_selected',   // Exchange method chosen
      'items_prepared',    // Both parties prepared items
      'in_transit',        // Items being exchanged
      'delivered',         // Items delivered
      'confirmed',         // Both parties confirmed receipt
      'completed',         // Swap fully completed with points awarded
      'disputed',          // Issue raised by either party
      'cancelled'          // Swap cancelled
    ],
    default: 'pending'
  },

  // Real-World Exchange Management
  exchangeMethod: {
    type: {
      type: String,
      enum: ['in_person', 'postal', 'drop_off_point', 'escrow_service'],
    },
    details: {
      // For in-person meetups
      meetupLocation: {
        name: String,
        address: String,
        coordinates: {
          lat: Number,
          lng: Number
        }
      },
      scheduledTime: Date,
      
      // For postal exchange
      shippingDetails: {
        requesterAddress: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: { type: String, default: 'US' }
        },
        providerAddress: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: { type: String, default: 'US' }
        },
        trackingNumbers: {
          requesterToProvider: String,
          providerToRequester: String
        },
        shippingService: {
          type: String,
          enum: ['usps', 'ups', 'fedex', 'dhl', 'other'],
          default: 'usps'
        },
        estimatedDelivery: {
          requesterItem: Date,
          providerItem: Date
        }
      },

      // For drop-off points
      dropOffPoint: {
        name: String,
        address: String,
        coordinates: {
          lat: Number,
          lng: Number
        },
        operatingHours: String,
        contactInfo: String
      }
    }
  },

  // Real-World Verification System
  verification: {
    requesterConfirmations: {
      itemPrepared: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date 
      },
      itemSent: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date, 
        proof: String  // Photo/receipt of shipping
      },
      itemReceived: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date, 
        condition: String  // Item condition upon receipt
      },
      satisfactionRating: { type: Number, min: 1, max: 5 }
    },
    providerConfirmations: {
      itemPrepared: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date 
      },
      itemSent: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date, 
        proof: String
      },
      itemReceived: { 
        confirmed: { type: Boolean, default: false }, 
        timestamp: Date, 
        condition: String
      },
      satisfactionRating: { type: Number, min: 1, max: 5 }
    },
    
    // Photo verification for trust and dispute resolution
    photos: {
      beforeShipping: {
        requesterItem: [String],
        providerItem: [String]
      },
      afterReceiving: {
        requesterItem: [String],
        providerItem: [String]
      }
    }
  },

  // Points and Environmental Impact Management
  pointsCalculation: {
    basePoints: {
      requester: { type: Number, default: 0 },
      provider: { type: Number, default: 0 }
    },
    bonusPoints: {
      sustainabilityBonus: { type: Number, default: 0 },
      qualityBonus: { type: Number, default: 0 },
      speedBonus: { type: Number, default: 0 }
    },
    totalPoints: {
      requester: { type: Number, default: 0 },
      provider: { type: Number, default: 0 }
    },
    pointsAwarded: { type: Boolean, default: false }
  },

  // Environmental Impact Tracking
  environmentalImpact: {
    totalCarbonSaved: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 }, // in liters
    wasteReduced: { type: Number, default: 0 }, // in kg
    calculatedAt: Date
  },

  // Timeline tracking for transparency
  timeline: [{
    event: String,
    timestamp: { type: Date, default: Date.now },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    details: String
  }],

  // Dispute management
  disputeResolution: {
    isDisputed: { type: Boolean, default: false },
    disputeReason: String,
    disputedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    disputeTimestamp: Date,
    resolution: String
  },

  // Analytics for platform improvement
  analytics: {
    responseTime: Number, // Time to accept/decline in minutes
    completionTime: Number, // Total time from request to completion in hours
    userSatisfactionScore: Number
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
SwapSchema.index({ 'requester.userId': 1, status: 1 });
SwapSchema.index({ 'provider.userId': 1, status: 1 });
SwapSchema.index({ status: 1, createdAt: -1 });
SwapSchema.index({ swapId: 1 }, { unique: true });

// Virtual for swap progress percentage
SwapSchema.virtual('progressPercentage').get(function(this: ISwap) {
  const statusProgress = {
    'pending': 10,
    'accepted': 20,
    'method_selected': 30,
    'items_prepared': 50,
    'in_transit': 70,
    'delivered': 85,
    'confirmed': 95,
    'completed': 100,
    'disputed': 40,
    'cancelled': 0
  };
  return statusProgress[this.status] || 0;
});

// Method to update swap status with timeline tracking
SwapSchema.methods.updateStatus = function(this: ISwap, newStatus: string, userId: string, details = '') {
  this.status = newStatus as any;
  this.timeline.push({
    event: `Status changed to ${newStatus}`,
    timestamp: new Date(),
    performedBy: userId,
    details: details
  });
  return this.save();
};

// Method to calculate environmental impact
SwapSchema.methods.calculateEnvironmentalImpact = function(this: ISwap) {
  const requesterCarbon = this.requester.item.carbonSaving || 0;
  const providerCarbon = this.provider.item.carbonSaving || 0;
  
  this.environmentalImpact = {
    totalCarbonSaved: requesterCarbon + providerCarbon,
    waterSaved: (requesterCarbon + providerCarbon) * 3.67, // Estimated water savings
    wasteReduced: (requesterCarbon + providerCarbon) * 0.5, // Estimated waste reduction
    calculatedAt: new Date()
  };
  
  return this.environmentalImpact;
};

// Method to award points upon completion
SwapSchema.methods.awardPoints = async function(this: ISwap) {
  if (this.pointsCalculation.pointsAwarded || this.status !== 'completed') return;

  const User = mongoose.model('User');
  
  // Calculate base points based on item values and sustainability
  const requesterBasePoints = Math.floor(this.requester.item.estimatedValue * 2);
  const providerBasePoints = Math.floor(this.provider.item.estimatedValue * 2);
  
  // Calculate bonus points
  const sustainabilityBonus = (this.requester.item.carbonSaving + this.provider.item.carbonSaving) * 10;
  const speedBonus = this.analytics?.completionTime && this.analytics.completionTime < 48 ? 50 : 0;
  
  this.pointsCalculation = {
    basePoints: {
      requester: requesterBasePoints,
      provider: providerBasePoints
    },
    bonusPoints: {
      sustainabilityBonus: sustainabilityBonus,
      speedBonus: speedBonus,
      qualityBonus: 0
    },
    totalPoints: {
      requester: requesterBasePoints + sustainabilityBonus + speedBonus,
      provider: providerBasePoints + sustainabilityBonus + speedBonus
    },
    pointsAwarded: true
  };

  // Award points to users
  await User.findByIdAndUpdate(this.requester.userId, {
    $inc: { 
      pointsBalance: this.pointsCalculation.totalPoints.requester,
      totalSwaps: 1,
      carbonSaved: this.requester.item.carbonSaving
    }
  });

  await User.findByIdAndUpdate(this.provider.userId, {
    $inc: { 
      pointsBalance: this.pointsCalculation.totalPoints.provider,
      totalSwaps: 1,
      carbonSaved: this.provider.item.carbonSaving
    }
  });

  return this.save();
};

// Static method to find swaps by user
SwapSchema.statics.findByUser = function(userId: string, status?: string) {
  const query: any = {
    $or: [
      { 'requester.userId': userId },
      { 'provider.userId': userId }
    ]
  };
  
  if (status) query.status = status;
  
  return this.find(query).sort({ createdAt: -1 });
};

// Validation
SwapSchema.pre('save', function(this: ISwap, next) {
  if (this.requester.userId.toString() === this.provider.userId.toString()) {
    return next(new Error('Cannot swap with yourself'));
  }
  next();
});

export default mongoose.models.Swap || mongoose.model<ISwap>('Swap', SwapSchema);
