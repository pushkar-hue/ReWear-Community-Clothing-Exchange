import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await connectDB();
    
    const { itemId } = params;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Find the item by either _id or itemId field
    let item;
    
    // Try to find by MongoDB _id first
    try {
      item = await Item.findById(itemId)
        .populate('userId', 'username ecoLevel sustainabilityScore')
        .lean();
    } catch (error) {
      // If that fails, try to find by itemId field (if it exists)
      item = await Item.findOne({ itemId })
        .populate('userId', 'username ecoLevel sustainabilityScore')
        .lean();
    }

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Transform the data for the frontend
    const itemData = {
      ...item,
      itemId: item._id, // Use _id as itemId for consistency
      owner: {
        username: item.userId?.username || 'Unknown User',
        ecoLevel: item.userId?.ecoLevel || 'Bronze',
        sustainabilityScore: item.userId?.sustainabilityScore || 0,
      },
      // Ensure images array exists
      images: item.images || [],
      // Add default values for required fields
      isAvailable: item.status === 'active',
      pointsRequired: item.pointsValue || 100,
      carbonSavings: item.estimatedCarbonSaving || 2.5,
    };

    return NextResponse.json({
      success: true,
      data: itemData,
    });

  } catch (error) {
    console.error('Get item error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}
