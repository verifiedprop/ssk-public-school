import Types "../types/instagram";

module {
  /// 30-minute TTL expressed in nanoseconds.
  public let CACHE_TTL_NS : Int = 1_800_000_000_000;

  /// Returns true when the cache is still valid.
  public func isCacheValid(cache : ?Types.FeedCache, now : Int) : Bool {
    switch (cache) {
      case (null) false;
      case (?c) (now - c.fetchedAt) < CACHE_TTL_NS;
    };
  };

  /// Build the Instagram Graph API URL for the given access token.
  public func buildApiUrl(accessToken : Text) : Text {
    "https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink,timestamp,like_count,comments_count&access_token=" # accessToken # "&limit=12";
  };

  /// Sample/demo posts shown when no token is configured.
  public func samplePosts() : [Types.InstagramPost] {
    [
      {
        id          = "demo_1";
        media_url   = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600";
        caption     = "🚀 Elevate your brand with cutting-edge digital marketing strategies! #DigitalMarketing #SocialMedia";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-15T10:00:00+0000";
        like_count  = 142;
        comments_count = 18;
        media_type  = "IMAGE";
      },
      {
        id          = "demo_2";
        media_url   = "https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07d?w=600";
        caption     = "📊 Data-driven SEO & Analytics that grow your business organically. #SEO #Analytics #Growth";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-12T14:30:00+0000";
        like_count  = 98;
        comments_count = 11;
        media_type  = "IMAGE";
      },
      {
        id          = "demo_3";
        media_url   = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600";
        caption     = "✨ Content creation that connects with your audience. #ContentMarketing #Branding";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-10T09:15:00+0000";
        like_count  = 215;
        comments_count = 27;
        media_type  = "IMAGE";
      },
      {
        id          = "demo_4";
        media_url   = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600";
        caption     = "💡 Paid advertising that delivers real ROI. #PaidAds #DigitalStrategy #ROI";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-08T16:45:00+0000";
        like_count  = 176;
        comments_count = 22;
        media_type  = "IMAGE";
      },
      {
        id          = "demo_5";
        media_url   = "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=600";
        caption     = "🎯 Brand development that makes you stand out from the crowd! #BrandDevelopment #Marketing";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-05T11:00:00+0000";
        like_count  = 189;
        comments_count = 31;
        media_type  = "IMAGE";
      },
      {
        id          = "demo_6";
        media_url   = "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600";
        caption     = "📱 Social media marketing that builds communities and drives engagement. #SocialMediaMarketing";
        permalink   = "https://www.instagram.com/ai_digital_marketing_mantra/";
        timestamp   = "2024-01-03T08:30:00+0000";
        like_count  = 134;
        comments_count = 15;
        media_type  = "IMAGE";
      },
    ];
  };
};
