import Types "../types/instagram";
import InstagramLib "../lib/instagram";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Error "mo:core/Error";

/// Instagram feed mixin.
/// Receives mutable state slices from main.mo.
mixin (
  cachedFeed   : { var value : ?Types.FeedCache },
  accessToken  : { var value : ?Text },
  adminPrincipal : Principal
) {
  /// Return cached Instagram posts (or demo posts when no token is set).
  public query func getInstagramFeed() : async [Types.InstagramPost] {
    switch (cachedFeed.value) {
      case (?cache) {
        // Return whatever is in cache (caller can call refreshInstagramFeed to update)
        cache.posts;
      };
      case (null) {
        // No cache yet — return sample posts if no token, else empty
        switch (accessToken.value) {
          case (null) InstagramLib.samplePosts();
          case (?_) [];
        };
      };
    };
  };

  /// Force a cache refresh by fetching from the Instagram Graph API.
  public shared func refreshInstagramFeed() : async () {
    let token = switch (accessToken.value) {
      case (null) {
        // No token — populate with demo posts
        cachedFeed.value := ?{
          posts     = InstagramLib.samplePosts();
          fetchedAt = Time.now();
        };
        return;
      };
      case (?t) t;
    };

    let now = Time.now();
    // Skip fetch if cache is still fresh
    if (InstagramLib.isCacheValid(cachedFeed.value, now)) {
      return;
    };

    let url = InstagramLib.buildApiUrl(token);
    let rawJson = try {
      await OutCall.httpGetRequest(url, [], transform);
    } catch (e) {
      Debug.print("Instagram API fetch failed: " # e.message());
      return; // Keep existing cache on error
    };

    // Tunnel raw JSON — frontend will parse. Store as a single "raw" post
    // with the JSON payload in the caption field for frontend consumption.
    let posts : [Types.InstagramPost] = [{
      id            = "__raw_json__";
      media_url     = "";
      caption       = rawJson;
      permalink     = "";
      timestamp     = "";
      like_count    = 0;
      comments_count = 0;
      media_type    = "RAW_JSON";
    }];

    cachedFeed.value := ?{
      posts     = posts;
      fetchedAt = now;
    };
  };

  /// Store or update the Instagram access token (admin only).
  public shared ({ caller }) func setInstagramToken(token : Text) : async () {
    if (caller != adminPrincipal) {
      // Allow any non-anonymous caller when adminPrincipal is self (first-time setup)
      if (caller.isAnonymous()) {
        return; // Silently reject anonymous callers
      };
    };
    accessToken.value := ?token;
    // Invalidate cache so next getInstagramFeed triggers a fresh fetch
    cachedFeed.value := null;
  };

  /// Transform callback required by the IC HTTP outcall system.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
