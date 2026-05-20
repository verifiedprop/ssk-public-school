module {
  /// A single Instagram post as returned by the Graph API.
  public type InstagramPost = {
    id          : Text;
    media_url   : Text;
    caption     : Text;
    permalink   : Text;
    timestamp   : Text;
    like_count  : Nat;
    comments_count : Nat;
    media_type  : Text;
  };

  /// Internal cache record.
  public type FeedCache = {
    posts     : [InstagramPost];
    fetchedAt : Int; // Time.now() nanoseconds
  };
};
