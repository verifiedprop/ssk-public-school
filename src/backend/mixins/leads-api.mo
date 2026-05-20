import List     "mo:core/List";
import Types    "../types/school";
import LeadLib  "../lib/leads";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

/// Exposes CRUD endpoints for admission lead management.
/// State injected: leads list, next-id counter, caller role resolver.
mixin (
  leads    : List.List<Types.Lead>,
  state    : { var nextLeadId : Nat },
  userRole : (Principal) -> ?Types.Role,
) {
  /// List all leads. Only SuperAdmin / Principal / AdmissionCounsellor.
  public shared query ({ caller }) func listLeads() : async [Types.Lead] {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not LeadLib.canManageLeads(role)) Runtime.trap("Unauthorized");
    leads.toArray();
  };

  /// Get a single lead by id.
  public shared query func getLead(id : Types.LeadId) : async ?Types.Lead {
    leads.find(func(l) { l.id == id });
  };

  /// Create a new admission lead (public endpoint — no auth required).
  public shared func createLead(input : Types.LeadInput) : async Types.Lead {
    let id  = state.nextLeadId;
    state.nextLeadId += 1;
    let now  = Time.now();
    let lead = LeadLib.newLead(id, input, now);
    leads.add(lead);
    lead;
  };

  /// Update an existing lead (auth required).
  public shared ({ caller }) func updateLead(id : Types.LeadId, input : Types.LeadInput) : async ?Types.Lead {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not LeadLib.canManageLeads(role)) Runtime.trap("Unauthorized");
    let now = Time.now();
    var updated : ?Types.Lead = null;
    leads.mapInPlace(func(l) {
      if (l.id == id) {
        let u = LeadLib.applyLeadUpdate(l, input, now);
        updated := ?u;
        u;
      } else l;
    });
    updated;
  };

  /// Delete a lead permanently.
  public shared ({ caller }) func deleteLead(id : Types.LeadId) : async Bool {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not LeadLib.canManageLeads(role)) Runtime.trap("Unauthorized");
    let sizeBefore = leads.size();
    // Rebuild list in-place by clearing and re-adding all non-matching leads
    let filtered = leads.filter(func(l : Types.Lead) : Bool { l.id != id });
    leads.clear();
    filtered.forEach(func(l : Types.Lead) { leads.add(l) });
    leads.size() < sizeBefore;
  };

  /// Filter leads by status.
  public shared query ({ caller }) func filterLeadsByStatus(status : Types.LeadStatus) : async [Types.Lead] {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not LeadLib.canManageLeads(role)) Runtime.trap("Unauthorized");
    leads.filter(func(l) { LeadLib.statusEqual(l.status, status) }).toArray();
  };

  /// Export all leads as flat rows suitable for CSV generation.
  public shared query ({ caller }) func exportLeads() : async [Types.LeadExportRow] {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not LeadLib.canManageLeads(role)) Runtime.trap("Unauthorized");
    leads.values().map(LeadLib.toExportRow).toArray();
  };
};
