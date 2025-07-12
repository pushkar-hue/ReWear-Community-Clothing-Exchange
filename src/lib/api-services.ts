// API Integration utilities for external services

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ARStylingRequest {
  imageUrl: string;
  category: string;
  styleType?: 'streetwear' | 'formal' | 'casual' | 'boho' | 'grunge';
}

export interface ARStylingResponse {
  styledImageUrl: string;
  confidence: number;
  styleDescription: string;
}

export interface VisionTaggingRequest {
  imageUrl: string;
}

export interface VisionTaggingResponse {
  tags: string[];
  colors: string[];
  fabric?: string;
  category?: string;
  confidence: number;
}

export interface StylistRequest {
  query: string;
  userPreferences?: {
    style: string[];
    size: string;
    categories: string[];
  };
  context?: {
    occasion: string;
    season: string;
  };
}

export interface StylistResponse {
  response: string;
  recommendations: {
    itemId: string;
    reason: string;
    confidence: number;
  }[];
  styleAdvice: string;
}

// Mock API implementations (replace with real API calls when available)
export class APIService {
  private static baseUrls = {
    arStyling: process.env.AR_STYLING_API || 'http://localhost:8001/api/ar-styling',
    visionTagging: process.env.VISION_TAGGING_API || 'http://localhost:8002/api/vision-tags',
    langchainStylist: process.env.LANGCHAIN_STYLIST_API || 'http://localhost:8000/api/stylist',
  };

  // AR Styling Service
  static async generateARStyling(request: ARStylingRequest): Promise<APIResponse<ARStylingResponse>> {
    try {
      // Mock implementation - replace with actual API call
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        return {
          success: true,
          data: {
            styledImageUrl: `/mock/styled-${Date.now()}.jpg`,
            confidence: 0.85,
            styleDescription: `${request.styleType || 'modern'} aesthetic with enhanced colors and styling`,
          },
        };
      }

      const response = await fetch(this.baseUrls.arStyling, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'AR styling failed' };
    }
  }

  // Vision Tagging Service
  static async generateVisionTags(request: VisionTaggingRequest): Promise<APIResponse<VisionTaggingResponse>> {
    try {
      // Mock implementation
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTags = ['cotton', 'casual', 'comfortable', 'everyday', 'classic'];
        const mockColors = ['blue', 'white', 'navy'];
        
        return {
          success: true,
          data: {
            tags: mockTags,
            colors: mockColors,
            fabric: 'cotton blend',
            category: 'tops',
            confidence: 0.92,
          },
        };
      }

      const response = await fetch(this.baseUrls.visionTagging, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Vision tagging failed' };
    }
  }

  // LangChain Stylist Service
  static async queryStylist(request: StylistRequest): Promise<APIResponse<StylistResponse>> {
    try {
      // Mock implementation
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return {
          success: true,
          data: {
            response: `Based on your query "${request.query}", I'd suggest mixing textures and focusing on sustainable pieces that can be styled multiple ways.`,
            recommendations: [
              { itemId: 'mock-item-1', reason: 'Versatile piece that matches your style', confidence: 0.9 },
              { itemId: 'mock-item-2', reason: 'Perfect for the occasion you mentioned', confidence: 0.8 },
            ],
            styleAdvice: 'Try layering these pieces for a more dynamic look!',
          },
        };
      }

      const response = await fetch(this.baseUrls.langchainStylist, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Stylist query failed' };
    }
  }

  // Utility function to check if APIs are available
  static async healthCheck(): Promise<{ arStyling: boolean; visionTagging: boolean; stylist: boolean }> {
    const checks = {
      arStyling: false,
      visionTagging: false,
      stylist: false,
    };

    try {
      // Skip health checks in development mode (using mocks)
      if (process.env.NODE_ENV === 'development') {
        return { arStyling: true, visionTagging: true, stylist: true };
      }

      // Check each API endpoint
      const promises = [
        fetch(`${this.baseUrls.arStyling}/health`).then(() => checks.arStyling = true).catch(() => {}),
        fetch(`${this.baseUrls.visionTagging}/health`).then(() => checks.visionTagging = true).catch(() => {}),
        fetch(`${this.baseUrls.langchainStylist}/health`).then(() => checks.stylist = true).catch(() => {}),
      ];

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Health check failed:', error);
    }

    return checks;
  }
}
