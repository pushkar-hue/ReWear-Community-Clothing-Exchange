import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LeaderboardEntry from '@/models/LeaderboardEntry';
import EcoChallenge from '@/models/EcoChallenge';

// Advanced leaderboard API with multiple ranking systems
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'overall'; // overall, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') || 'all'; // all, carbon, swaps, score
    const ecoLevel = searchParams.get('ecoLevel'); // filter by eco level
    
    // Build query for filtered leaderboard
    let query: any = {};
    if (ecoLevel && ecoLevel !== 'all') {
      query.ecoLevel = ecoLevel;
    }
    
    // Determine sort field based on category and period
    let sortField = 'sustainabilityScore';
    if (category === 'carbon') {
      sortField = 'totalCarbonSaved';
    } else if (category === 'swaps') {
      sortField = 'totalSwaps';
    } else if (period === 'weekly') {
      sortField = 'weeklyScore';
    } else if (period === 'monthly') {
      sortField = 'monthlyScore';
    }
    
    // Get leaderboard entries with advanced aggregation
    const leaderboard = await LeaderboardEntry.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                createdAt: 1,
                // Don't expose sensitive data
              }
            }
          ]
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userDetails', 0] },
          // Calculate performance metrics
          avgCarbonPerSwap: {
            $cond: {
              if: { $gt: ['$totalSwaps', 0] },
              then: { $divide: ['$totalCarbonSaved', '$totalSwaps'] },
              else: 0
            }
          },
          memberSince: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $arrayElemAt: ['$userDetails.createdAt', 0] }
            }
          }
        }
      },
      {
        $project: {
          userDetails: 0, // Remove the lookup array
        }
      },
      { $sort: { [sortField]: -1 } },
      { $limit: limit },
      {
        $addFields: {
          rank: { $add: [{ $indexOfArray: [{ $map: { input: { $range: [0, limit] }, as: 'i', in: '$$i' } }, { $subtract: [{ $indexOfArray: [{ $map: { input: { $range: [0, limit] }, as: 'i', in: '$$i' } }, { $subtract: [{ $indexOfArray: [{ $map: { input: { $range: [0, limit] }, as: 'i', in: '$$i' } }, 0] }] }] }, 0] }] }, 1] }
        }
      }
    ]);
    
    // Add sequential ranking
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      // Calculate trend indicators
      trend: calculateTrend(entry, period),
      // Add performance badges
      badges: calculateBadges(entry),
    }));
    
    // Get leaderboard statistics
    const stats = await LeaderboardEntry.aggregate([
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: 1 },
          totalCarbonSaved: { $sum: '$totalCarbonSaved' },
          totalSwaps: { $sum: '$totalSwaps' },
          avgSustainabilityScore: { $avg: '$sustainabilityScore' },
          topEcoLevel: { $max: '$ecoLevel' },
        }
      }
    ]);
    
    // Get active challenges for context
    const activeChallenges = await EcoChallenge.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).sort({ endDate: 1 });
    
    return NextResponse.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        statistics: stats[0] || {
          totalParticipants: 0,
          totalCarbonSaved: 0,
          totalSwaps: 0,
          avgSustainabilityScore: 0,
          topEcoLevel: 'Bronze',
        },
        activeChallenges: activeChallenges.map((challenge: any) => ({
          id: challenge._id,
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          target: challenge.target,
          unit: challenge.unit,
          icon: challenge.icon,
          difficulty: challenge.difficulty,
          endDate: challenge.endDate,
          participantCount: challenge.participants.length,
        })),
        filters: {
          period,
          category,
          ecoLevel,
          limit,
        },
        meta: {
          lastUpdated: new Date().toISOString(),
          updateFrequency: 'Real-time',
        }
      }
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard',
        message: 'An error occurred while calculating rankings',
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate trend indicators
function calculateTrend(entry: any, period: string): string {
  // Mock trend calculation (in real app, compare with previous period)
  const currentScore = period === 'weekly' ? entry.weeklyScore : 
                      period === 'monthly' ? entry.monthlyScore : 
                      entry.sustainabilityScore;
  
  if (currentScore > 800) return 'rising';
  if (currentScore > 400) return 'stable';
  return 'new';
}

// Helper function to calculate performance badges
function calculateBadges(entry: any): string[] {
  const badges = [];
  
  if (entry.totalCarbonSaved > 500) badges.push('🌍 Planet Saver');
  if (entry.totalSwaps > 50) badges.push('🔄 Swap Legend');
  if (entry.ecoLevel === 'Master') badges.push('👑 Eco Master');
  if (entry.ecoLevel === 'Diamond') badges.push('💎 Diamond Member');
  if (entry.avgCarbonPerSwap > 5) badges.push('⚡ Efficiency Expert');
  if (entry.sustainabilityScore > 1000) badges.push('🏆 Sustainability Champion');
  
  return badges;
}

// POST endpoint to update user's leaderboard entry
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return NextResponse.json(
        { error: 'User ID and data are required' },
        { status: 400 }
      );
    }
    
    // Update leaderboard entry
    const updatedEntry = await LeaderboardEntry.findOneAndUpdate(
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
    
    // Update challenge progress
    const activeChallenges = await EcoChallenge.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    for (const challenge of activeChallenges) {
      await updateChallengeProgress(challenge, userId, userData);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        leaderboardEntry: updatedEntry,
        message: 'Leaderboard updated successfully',
      }
    });

  } catch (error) {
    console.error('Leaderboard update error:', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard' },
      { status: 500 }
    );
  }
}

// Helper function to update challenge progress
async function updateChallengeProgress(challenge: any, userId: string, userData: any) {
  let progress = 0;
  
  switch (challenge.category) {
    case 'carbon_reduction':
      progress = userData.carbonSaved || 0;
      break;
    case 'swap_count':
      progress = userData.totalSwaps || 0;
      break;
    case 'listing_quality':
      progress = userData.totalItemsListed || 0;
      break;
    case 'community_engagement':
      // This would require additional tracking
      progress = Math.floor((userData.totalSwaps || 0) / 10); // Simplified
      break;
  }
  
  await challenge.updateProgress(userId, progress);
}
