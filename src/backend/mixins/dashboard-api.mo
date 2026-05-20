import List     "mo:core/List";
import Types    "../types/school";
import DashLib  "../lib/dashboard";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

/// Exposes dashboard analytics endpoints.
/// State injected: students list, leads list, caller role resolver.
mixin (
  students : List.List<Types.Student>,
  leads    : List.List<Types.Lead>,
  userRole : (Principal) -> ?Types.Role,
) {
  /// Return aggregate analytics for the admin dashboard.
  public shared query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    switch role {
      case (#SuperAdmin or #Principal) {};
      case _ Runtime.trap("Unauthorized");
    };
    let now        = Time.now();
    let dayNs      = 86_400_000_000_000; // 24h in nanoseconds
    let dayStartNs = now - dayNs;
    DashLib.computeStats(students, leads, dayStartNs);
  };
};
