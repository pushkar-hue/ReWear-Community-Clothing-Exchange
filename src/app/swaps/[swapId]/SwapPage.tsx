import { use } from 'react';
import SwapManagement from './SwapManagement';

// Server component to extract swapId from params
export default function SwapPage({ params }: { params: Promise<{ swapId: string }> }) {
  const { swapId } = use(params);
  return <SwapManagement swapId={swapId} />;
}

export async function generateMetadata({ params }: { params: Promise<{ swapId: string }> }) {
  const { swapId } = await params;
  return {
    title: `Swap Management - ${swapId} | ReWear`,
    description: 'Track and manage your sustainable clothing swap with real-time logistics and verification.'
  };
}
