import { useQuery } from "@tanstack/react-query";
import type { InstagramPost } from "../types/instagram";

const INSTAGRAM_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Mock posts for when the backend isn't returning data yet
const MOCK_POSTS: InstagramPost[] = [
  {
    id: "1",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "🚀 Elevating brands with data-driven digital marketing strategies! #DigitalMarketing #AIMarketing",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date().toISOString(),
    like_count: BigInt(142),
    comments_count: BigInt(18),
    media_type: "IMAGE",
  },
  {
    id: "2",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "💡 Content is king, but strategy is the kingdom. Let us build yours. #ContentMarketing",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    like_count: BigInt(98),
    comments_count: BigInt(11),
    media_type: "IMAGE",
  },
  {
    id: "3",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "📊 SEO + AI = unstoppable growth. See how we 3x'd organic traffic for our client! #SEO #Analytics",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    like_count: BigInt(215),
    comments_count: BigInt(34),
    media_type: "IMAGE",
  },
  {
    id: "4",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "🎯 Paid ads that actually convert. Stop wasting budget, start getting ROI. #PaidAds",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    like_count: BigInt(176),
    comments_count: BigInt(22),
    media_type: "IMAGE",
  },
  {
    id: "5",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "✨ Your brand story deserves to be told beautifully. Let's create something remarkable. #BrandDevelopment",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    like_count: BigInt(203),
    comments_count: BigInt(29),
    media_type: "IMAGE",
  },
  {
    id: "6",
    media_url: "/assets/generated/hero-agency.dim_1200x700.jpg",
    caption:
      "🌟 Social media isn't just posting — it's building a community. We grow yours. #SocialMedia",
    permalink: "https://www.instagram.com/ai_digital_marketing_mantra/",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    like_count: BigInt(167),
    comments_count: BigInt(15),
    media_type: "IMAGE",
  },
];

export function useInstagramFeed() {
  return useQuery<InstagramPost[]>({
    queryKey: ["instagram-feed"],
    queryFn: async () => {
      // Backend integration: when getInstagramFeed is available, use it
      // const result = await actor.getInstagramFeed();
      // if ('ok' in result) return result.ok.map(p => ({ ...p, like_count: p.like_count, comments_count: p.comments_count }));
      return MOCK_POSTS;
    },
    staleTime: INSTAGRAM_REFRESH_INTERVAL,
    refetchInterval: INSTAGRAM_REFRESH_INTERVAL,
  });
}
