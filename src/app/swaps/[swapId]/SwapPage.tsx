import SwapManagement from './SwapManagement';

// Server component to extract swapId from params
export default function SwapPage({ params }: { params: { swapId: string } }) {
  return <SwapManagement swapId={params.swapId} />;
}

export function generateMetadata({ params }: { params: { swapId: string } }) {
  return {
    title: `Swap Management - ${params.swapId} | ReWear`,
    description: 'Track and manage your sustainable clothing swap with real-time logistics and verification.'
  };
}
