import mongoose from 'mongoose';

// Eco-challenges schema for competitive sustainability tracking
const EcoChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['weekly', 'monthly', 'seasonal', 'special'],
    required: true,
  },
  category: {
    type: String,
    enum: ['carbon_reduction', 'swap_count', 'listing_quality', 'community_engagement'],
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true, // e.g., 'kg CO2', 'swaps', 'items', 'points'
  },
  rewards: {
    points: { type: Number, default: 0 },
    badge: { type: String },
    ecoLevelBonus: { type: Number, default: 0 },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    rank: Number,
  }],
  icon: {
    type: String,
    default: '🌱',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
}, {
  timestamps: true,
});

// Indexes for efficient challenge queries
EcoChallengeSchema.index({ isActive: 1, endDate: 1 });
EcoChallengeSchema.index({ type: 1, isActive: 1 });
EcoChallengeSchema.index({ startDate: 1, endDate: 1 });

// Methods for challenge management
EcoChallengeSchema.methods.addParticipant = async function(userId) {
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (!existingParticipant) {
    this.participants.push({
      userId,
      progress: 0,
      completed: false,
    });
    await this.save();
  }
  
  return this;
};

EcoChallengeSchema.methods.updateProgress = async function(userId, newProgress) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (participant) {
    participant.progress = newProgress;
    
    if (newProgress >= this.target && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();
      
      // Award points to user
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(userId, {
        $inc: { 
          pointsBalance: this.rewards.points,
          sustainabilityScore: this.rewards.ecoLevelBonus,
        }
      });
    }
    
    await this.save();
  }
  
  return participant;
};

// Static method to get active challenges
EcoChallengeSchema.statics.getActiveChallenges = async function() {
  const now = new Date();
  return await this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ endDate: 1 });
};

// Static method to create default challenges
EcoChallengeSchema.statics.createDefaultChallenges = async function() {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const defaultChallenges = [
    {
      title: "Weekly Carbon Saver",
      description: "Save 10kg of CO2 this week through sustainable swapping",
      type: "weekly",
      category: "carbon_reduction",
      target: 10,
      unit: "kg CO2",
      rewards: { points: 100, badge: "🌍 Carbon Warrior" },
      startDate: now,
      endDate: weekFromNow,
      icon: "🌍",
      difficulty: "easy",
    },
    {
      title: "Swap Master Challenge",
      description: "Complete 5 successful swaps this month",
      type: "monthly",
      category: "swap_count",
      target: 5,
      unit: "swaps",
      rewards: { points: 250, badge: "🔄 Swap Master", ecoLevelBonus: 50 },
      startDate: now,
      endDate: monthFromNow,
      icon: "🔄",
      difficulty: "medium",
    },
    {
      title: "Quality Curator",
      description: "List 10 high-quality items with detailed descriptions",
      type: "monthly",
      category: "listing_quality",
      target: 10,
      unit: "items",
      rewards: { points: 200, badge: "✨ Quality Curator" },
      startDate: now,
      endDate: monthFromNow,
      icon: "✨",
      difficulty: "medium",
    },
    {
      title: "Community Builder",
      description: "Help 3 new users complete their first swap",
      type: "monthly",
      category: "community_engagement",
      target: 3,
      unit: "mentorships",
      rewards: { points: 300, badge: "🤝 Community Hero", ecoLevelBonus: 75 },
      startDate: now,
      endDate: monthFromNow,
      icon: "🤝",
      difficulty: "hard",
    },
  ];
  
  for (const challenge of defaultChallenges) {
    await this.findOneAndUpdate(
      { title: challenge.title, type: challenge.type },
      challenge,
      { upsert: true, new: true }
    );
  }
};

const EcoChallenge = mongoose.models.EcoChallenge || mongoose.model('EcoChallenge', EcoChallengeSchema);

export default EcoChallenge;
