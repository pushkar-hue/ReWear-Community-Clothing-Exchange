import mongoose from 'mongoose';

// Leaderboard entry schema for competitive sustainability tracking
const LeaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  totalCarbonSaved: {
    type: Number,
    required: true,
    default: 0,
  },
  totalSwaps: {
    type: Number,
    required: true,
    default: 0,
  },
  sustainabilityScore: {
    type: Number,
    required: true,
    default: 0,
  },
  ecoLevel: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'],
    required: true,
  },
  weeklyScore: {
    type: Number,
    default: 0,
  },
  monthlyScore: {
    type: Number,
    default: 0,
  },
  rank: {
    overall: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
  },
  achievements: [{
    type: String,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  // Competition tracking
  currentChallenges: [{
    challengeId: String,
    progress: Number,
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
}, {
  timestamps: true,
});

// Indexes for efficient leaderboard queries
LeaderboardEntrySchema.index({ sustainabilityScore: -1 });
LeaderboardEntrySchema.index({ totalCarbonSaved: -1 });
LeaderboardEntrySchema.index({ weeklyScore: -1 });
LeaderboardEntrySchema.index({ monthlyScore: -1 });
LeaderboardEntrySchema.index({ userId: 1 }, { unique: true });

// Methods for leaderboard calculations
LeaderboardEntrySchema.methods.calculateRank = async function() {
  const LeaderboardEntry = mongoose.model('LeaderboardEntry');
  
  // Overall rank
  const overallRank = await LeaderboardEntry.countDocuments({
    sustainabilityScore: { $gt: this.sustainabilityScore }
  }) + 1;
  
  // Weekly rank
  const weeklyRank = await LeaderboardEntry.countDocuments({
    weeklyScore: { $gt: this.weeklyScore }
  }) + 1;
  
  // Monthly rank
  const monthlyRank = await LeaderboardEntry.countDocuments({
    monthlyScore: { $gt: this.monthlyScore }
  }) + 1;
  
  this.rank = {
    overall: overallRank,
    weekly: weeklyRank,
    monthly: monthlyRank,
  };
  
  return this.rank;
};

// Static method to update leaderboard
LeaderboardEntrySchema.statics.updateUserEntry = async function(userId, userData) {
  const entry = await this.findOneAndUpdate(
    { userId },
    {
      username: userData.username,
      totalCarbonSaved: userData.carbonSaved,
      totalSwaps: userData.totalSwaps,
      sustainabilityScore: userData.sustainabilityScore,
      ecoLevel: userData.ecoLevel,
      lastUpdated: new Date(),
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true,
    }
  );
  
  await entry.calculateRank();
  await entry.save();
  
  return entry;
};

// Static method to get top performers
LeaderboardEntrySchema.statics.getTopPerformers = async function(limit = 10, period = 'overall') {
  const sortField = period === 'weekly' ? 'weeklyScore' : 
                   period === 'monthly' ? 'monthlyScore' : 
                   'sustainabilityScore';
  
  return await this.find({})
    .sort({ [sortField]: -1 })
    .limit(limit)
    .populate('userId', 'username email createdAt')
    .lean();
};

const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model('LeaderboardEntry', LeaderboardEntrySchema);

export default LeaderboardEntry;
