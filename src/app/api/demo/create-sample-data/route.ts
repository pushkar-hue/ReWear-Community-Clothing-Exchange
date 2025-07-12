import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';

// Sample items data
const sampleItems = [
  {
    title: "Vintage Denim Jacket",
    description: "Classic blue denim jacket in excellent condition. Perfect for layering and has that authentic vintage look.",
    category: "outerwear",
    type: "jacket",
    size: "M",
    condition: "Like New",
    tags: ["vintage", "denim", "classic", "layering"],
    images: ["/uploads/demo/jacket1.jpg"],
    pointsValue: 150,
    estimatedCarbonSaving: 3.2,
    status: "active"
  },
  {
    title: "Floral Summer Dress",
    description: "Beautiful floral print summer dress. Light and breathable fabric, perfect for warm weather.",
    category: "dresses",
    type: "casual dress",
    size: "S",
    condition: "Good",
    tags: ["floral", "summer", "light", "comfortable"],
    images: ["/uploads/demo/dress1.jpg"],
    pointsValue: 120,
    estimatedCarbonSaving: 2.8,
    status: "active"
  },
  {
    title: "Black Skinny Jeans",
    description: "Comfortable black skinny jeans with stretch. Great fit and very versatile.",
    category: "bottoms",
    type: "jeans",
    size: "L",
    condition: "Good",
    tags: ["jeans", "black", "skinny", "versatile"],
    images: ["/uploads/demo/jeans1.jpg"],
    pointsValue: 100,
    estimatedCarbonSaving: 2.5,
    status: "active"
  },
  {
    title: "White Cotton T-Shirt",
    description: "Basic white cotton t-shirt. Soft and comfortable, perfect for everyday wear.",
    category: "tops",
    type: "t-shirt",
    size: "M",
    condition: "New",
    tags: ["cotton", "white", "basic", "comfortable"],
    images: ["/uploads/demo/tshirt1.jpg"],
    pointsValue: 80,
    estimatedCarbonSaving: 1.8,
    status: "active"
  },
  {
    title: "Brown Leather Boots",
    description: "Genuine leather boots in brown. Sturdy and stylish, perfect for autumn and winter.",
    category: "shoes",
    type: "boots",
    size: "M",
    condition: "Like New",
    tags: ["leather", "brown", "boots", "winter"],
    images: ["/uploads/demo/boots1.jpg"],
    pointsValue: 200,
    estimatedCarbonSaving: 4.2,
    status: "active"
  }
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Create a demo user if it doesn't exist
    let demoUser = await User.findOne({ email: 'demo@rewear.com' });
    
    if (!demoUser) {
      demoUser = await User.create({
        username: 'demo_user',
        email: 'demo@rewear.com',
        password: 'hashedpassword', // This would be properly hashed in real scenario
        pointsBalance: 1000,
        sustainabilityScore: 85,
        ecoLevel: 'Gold',
        totalSwaps: 5,
        totalItemsListed: 10,
        carbonSaved: 25.5,
      });
    }

    // Clear existing demo items
    await Item.deleteMany({ userId: demoUser._id });

    // Create sample items
    const itemsToCreate = sampleItems.map(item => ({
      ...item,
      userId: demoUser._id,
      views: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
    }));

    const createdItems = await Item.insertMany(itemsToCreate);

    return NextResponse.json({
      success: true,
      message: `Created ${createdItems.length} sample items`,
      items: createdItems.length,
      user: {
        username: demoUser.username,
        email: demoUser.email,
      }
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { error: 'Failed to create sample data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
