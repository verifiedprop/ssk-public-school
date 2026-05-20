import Map    "mo:core/Map";
import Types  "../types/school";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

/// Manages user principal → role registration and lookup.
/// State injected: users map.
mixin (
  users     : Map.Map<Principal, Types.UserProfile>,
  superAdmin : { var value : ?Principal },
) {
  /// Bootstrap: assign the calling principal the SuperAdmin role.
  /// Can only be called once — subsequent calls trap if SuperAdmin already set.
  public shared ({ caller }) func bootstrapSuperAdmin(name : Text) : async () {
    if (superAdmin.value != null) {
      Runtime.trap("SuperAdmin already bootstrapped");
    };
    let now = Time.now();
    let profile : Types.UserProfile = {
      principal = caller;
      role      = #SuperAdmin;
      name;
      createdAt = now;
    };
    users.add(caller, profile);
    superAdmin.value := ?caller;
  };

  /// Assign a role to a principal. Only SuperAdmin may call.
  public shared ({ caller }) func assignRole(target : Principal, role : Types.Role, name : Text) : async () {
    switch (superAdmin.value) {
      case (?sa) {
        if (caller != sa) Runtime.trap("Only SuperAdmin can assign roles");
      };
      case null Runtime.trap("Not bootstrapped");
    };
    let now = Time.now();
    let existing = users.get(target);
    let createdAt = switch existing {
      case (?p) p.createdAt;
      case null now;
    };
    let profile : Types.UserProfile = {
      principal = target;
      role;
      name;
      createdAt;
    };
    users.add(target, profile);
  };

  /// Remove a user's role. Only SuperAdmin may call.
  public shared ({ caller }) func revokeRole(target : Principal) : async () {
    switch (superAdmin.value) {
      case (?sa) {
        if (caller != sa) Runtime.trap("Only SuperAdmin can revoke roles");
      };
      case null Runtime.trap("Not bootstrapped");
    };
    users.remove(target);
  };

  /// Look up the role of a principal.
  public shared query func getRole(target : Principal) : async ?Types.Role {
    switch (users.get(target)) {
      case (?profile) ?profile.role;
      case null null;
    };
  };

  /// Get the full profile of the calling principal.
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    users.get(caller);
  };

  /// List all registered users. Only SuperAdmin / Principal may call.
  public shared query ({ caller }) func listUsers() : async [Types.UserProfile] {
    let callerRole = switch (users.get(caller)) {
      case (?p) p.role;
      case null Runtime.trap("Unauthorized");
    };
    switch callerRole {
      case (#SuperAdmin or #Principal) {};
      case _ Runtime.trap("Unauthorized");
    };
    users.values().toArray();
  };
};
