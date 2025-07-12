import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Swap from '@/models/Swap';
import User from '@/models/User';
import Item from '@/models/Item';

// Advanced Swap Management API with Real-World Logistics
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { action, swapId, ...data } = body;

    switch (action) {
      case 'create_swap_request':
        return await createSwapRequest(data);
      
      case 'respond_to_swap':
        return await respondToSwap(swapId, data);
      
      case 'select_exchange_method':
        return await selectExchangeMethod(swapId, data);
      
      case 'confirm_item_prepared':
        return await confirmItemPrepared(swapId, data);
      
      case 'confirm_item_sent':
        return await confirmItemSent(swapId, data);
      
      case 'confirm_item_received':
        return await confirmItemReceived(swapId, data);
      
      case 'update_tracking':
        return await updateTracking(swapId, data);
      
      case 'complete_swap':
        return await completeSwap(swapId, data);
      
      case 'dispute_swap':
        return await disputeSwap(swapId, data);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Swap API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving swaps
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const swapId = searchParams.get('swapId');

    if (swapId) {
      // Get specific swap with full details
      const swap = await Swap.findOne({ swapId })
        .populate('requester.userId', 'username email ecoLevel')
        .populate('provider.userId', 'username email ecoLevel')
        .populate('requester.item.itemId')
        .populate('provider.item.itemId');
      
      if (!swap) {
        return NextResponse.json(
          { error: 'Swap not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: swap
      });
    }

    if (userId) {
      // Get user's swaps
      const query: any = {
        $or: [
          { 'requester.userId': userId },
          { 'provider.userId': userId }
        ]
      };
      
      if (status) query.status = status;
      
      const swaps = await Swap.find(query)
        .sort({ createdAt: -1 })
        .populate('requester.userId', 'username ecoLevel')
        .populate('provider.userId', 'username ecoLevel')
        .limit(50);

      return NextResponse.json({
        success: true,
        data: swaps
      });
    }

    return NextResponse.json(
      { error: 'User ID or Swap ID required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Get swaps error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve swaps' },
      { status: 500 }
    );
  }
}

// Create a new swap request
async function createSwapRequest(data: any) {
  const { requesterId, providerId, requestedItemId, offeredItemId, message } = data;

  // Validation
  if (!requesterId || !providerId || !requestedItemId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Get user and item details
  const [requester, provider, requestedItem, offeredItem] = await Promise.all([
    User.findById(requesterId),
    User.findById(providerId),
    Item.findById(requestedItemId),
    offeredItemId ? Item.findById(offeredItemId) : null
  ]);

  if (!requester || !provider || !requestedItem) {
    return NextResponse.json(
      { error: 'Invalid user or item IDs' },
      { status: 400 }
    );
  }

  // Create swap
  const swap = new Swap({
    requester: {
      userId: requesterId,
      username: requester.username,
      item: {
        itemId: offeredItem?._id || requestedItemId,
        title: offeredItem?.title || 'Points Exchange',
        images: offeredItem?.images || [],
        estimatedValue: offeredItem?.price || 0,
        carbonSaving: offeredItem?.carbonSavingEstimate || 0
      }
    },
    provider: {
      userId: providerId,
      username: provider.username,
      item: {
        itemId: requestedItemId,
        title: requestedItem.title,
        images: requestedItem.images,
        estimatedValue: requestedItem.price,
        carbonSaving: requestedItem.carbonSavingEstimate
      }
    },
    status: 'pending'
  });

  // Add initial timeline entry
  swap.timeline.push({
    event: 'Swap request created',
    timestamp: new Date(),
    performedBy: requesterId,
    details: message || 'Initial swap request'
  });

  await swap.save();

  return NextResponse.json({
    success: true,
    message: 'Swap request created successfully',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage
    }
  }, { status: 201 });
}

// Respond to swap request (accept/decline)
async function respondToSwap(swapId: string, data: any) {
  const { userId, response, message } = data; // response: 'accept' | 'decline'

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  if (swap.provider.userId.toString() !== userId) {
    return NextResponse.json(
      { error: 'Only the provider can respond to this request' },
      { status: 403 }
    );
  }

  const newStatus = response === 'accept' ? 'accepted' : 'declined';
  await swap.updateStatus(newStatus, userId, message || `Request ${response}ed`);

  return NextResponse.json({
    success: true,
    message: `Swap ${response}ed successfully`,
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage
    }
  });
}

// Select exchange method (in-person, postal, drop-off, etc.)
async function selectExchangeMethod(swapId: string, data: any) {
  const { userId, exchangeMethod } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  // Both parties need to agree on exchange method
  swap.exchangeMethod = exchangeMethod;
  await swap.updateStatus('method_selected', userId, `Exchange method selected: ${exchangeMethod.type}`);

  return NextResponse.json({
    success: true,
    message: 'Exchange method selected successfully',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      exchangeMethod: swap.exchangeMethod,
      progressPercentage: swap.progressPercentage
    }
  });
}

// Confirm item is prepared for exchange
async function confirmItemPrepared(swapId: string, data: any) {
  const { userId, photos, notes } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  const isRequester = swap.requester.userId.toString() === userId;
  const confirmationPath = isRequester ? 'requesterConfirmations' : 'providerConfirmations';
  
  swap.verification[confirmationPath].itemPrepared = {
    confirmed: true,
    timestamp: new Date()
  };

  // Add photos if provided
  if (photos && photos.length > 0) {
    if (isRequester) {
      swap.verification.photos.beforeShipping.requesterItem = photos;
    } else {
      swap.verification.photos.beforeShipping.providerItem = photos;
    }
  }

  // Check if both parties have prepared items
  const bothPrepared = swap.verification.requesterConfirmations.itemPrepared.confirmed && 
                      swap.verification.providerConfirmations.itemPrepared.confirmed;

  if (bothPrepared) {
    await swap.updateStatus('items_prepared', userId, 'Both items prepared for exchange');
  } else {
    await swap.save();
  }

  return NextResponse.json({
    success: true,
    message: 'Item preparation confirmed',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage,
      bothPrepared
    }
  });
}

// Confirm item has been sent
async function confirmItemSent(swapId: string, data: any) {
  const { userId, trackingNumber, shippingService, photos, estimatedDelivery } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  const isRequester = swap.requester.userId.toString() === userId;
  const confirmationPath = isRequester ? 'requesterConfirmations' : 'providerConfirmations';
  
  swap.verification[confirmationPath].itemSent = {
    confirmed: true,
    timestamp: new Date(),
    proof: trackingNumber || 'Hand delivery'
  };

  // Update tracking information if postal
  if (swap.exchangeMethod.type === 'postal' && trackingNumber) {
    if (isRequester) {
      swap.exchangeMethod.details.shippingDetails.trackingNumbers.requesterToProvider = trackingNumber;
      if (estimatedDelivery) {
        swap.exchangeMethod.details.shippingDetails.estimatedDelivery.requesterItem = new Date(estimatedDelivery);
      }
    } else {
      swap.exchangeMethod.details.shippingDetails.trackingNumbers.providerToRequester = trackingNumber;
      if (estimatedDelivery) {
        swap.exchangeMethod.details.shippingDetails.estimatedDelivery.providerItem = new Date(estimatedDelivery);
      }
    }
  }

  // Check if both items are in transit
  const bothSent = swap.verification.requesterConfirmations.itemSent.confirmed && 
                   swap.verification.providerConfirmations.itemSent.confirmed;

  if (bothSent) {
    await swap.updateStatus('in_transit', userId, 'Both items are in transit');
  } else {
    await swap.save();
  }

  return NextResponse.json({
    success: true,
    message: 'Item shipment confirmed',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage,
      trackingInfo: swap.exchangeMethod.details.shippingDetails?.trackingNumbers
    }
  });
}

// Confirm item has been received
async function confirmItemReceived(swapId: string, data: any) {
  const { userId, condition, satisfactionRating, photos, notes } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  const isRequester = swap.requester.userId.toString() === userId;
  const confirmationPath = isRequester ? 'requesterConfirmations' : 'providerConfirmations';
  
  swap.verification[confirmationPath].itemReceived = {
    confirmed: true,
    timestamp: new Date(),
    condition: condition
  };

  if (satisfactionRating) {
    swap.verification[confirmationPath].satisfactionRating = satisfactionRating;
  }

  // Add photos if provided
  if (photos && photos.length > 0) {
    if (isRequester) {
      swap.verification.photos.afterReceiving.requesterItem = photos;
    } else {
      swap.verification.photos.afterReceiving.providerItem = photos;
    }
  }

  // Check if both parties have confirmed receipt
  const bothReceived = swap.verification.requesterConfirmations.itemReceived.confirmed && 
                       swap.verification.providerConfirmations.itemReceived.confirmed;

  if (bothReceived) {
    await swap.updateStatus('confirmed', userId, 'Both parties confirmed receipt');
    
    // Automatically complete if both parties are satisfied
    const bothSatisfied = (swap.verification.requesterConfirmations.satisfactionRating || 0) >= 3 &&
                          (swap.verification.providerConfirmations.satisfactionRating || 0) >= 3;
    
    if (bothSatisfied) {
      await completeSwapInternal(swap);
    }
  } else {
    await swap.save();
  }

  return NextResponse.json({
    success: true,
    message: 'Item receipt confirmed',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage,
      bothReceived,
      canComplete: bothReceived
    }
  });
}

// Update tracking information
async function updateTracking(swapId: string, data: any) {
  const { trackingUpdates } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  // Add tracking updates to timeline
  for (const update of trackingUpdates) {
    swap.timeline.push({
      event: 'Tracking update',
      timestamp: new Date(),
      performedBy: 'system',
      details: update.message
    });
  }

  await swap.save();

  return NextResponse.json({
    success: true,
    message: 'Tracking information updated',
    data: {
      swapId: swap.swapId,
      timeline: swap.timeline.slice(-5) // Last 5 updates
    }
  });
}

// Complete the swap and award points
async function completeSwap(swapId: string, data: any) {
  const { userId } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  return await completeSwapInternal(swap, userId);
}

// Internal function to complete swap
async function completeSwapInternal(swap: any, userId?: string) {
  // Calculate environmental impact
  swap.calculateEnvironmentalImpact();
  
  // Award points
  await swap.awardPoints();
  
  // Update status
  await swap.updateStatus('completed', userId || 'system', 'Swap completed successfully');

  return NextResponse.json({
    success: true,
    message: 'Swap completed successfully! Points have been awarded.',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      progressPercentage: swap.progressPercentage,
      pointsAwarded: swap.pointsCalculation.totalPoints,
      environmentalImpact: swap.environmentalImpact
    }
  });
}

// Handle disputes
async function disputeSwap(swapId: string, data: any) {
  const { userId, reason, evidence } = data;

  const swap = await Swap.findOne({ swapId });
  if (!swap) {
    return NextResponse.json(
      { error: 'Swap not found' },
      { status: 404 }
    );
  }

  swap.disputeResolution = {
    isDisputed: true,
    disputeReason: reason,
    disputedBy: userId,
    disputeTimestamp: new Date()
  };

  await swap.updateStatus('disputed', userId, `Dispute raised: ${reason}`);

  return NextResponse.json({
    success: true,
    message: 'Dispute has been logged. Our team will review it shortly.',
    data: {
      swapId: swap.swapId,
      status: swap.status,
      disputeId: `DISP-${swap.swapId}-${Date.now()}`
    }
  });
}
