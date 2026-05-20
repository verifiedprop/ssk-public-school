import Types  "../types/school";

module {
  /// Returns true if the caller's role may manage admission leads.
  public func canManageLeads(role : Types.Role) : Bool {
    switch role {
      case (#SuperAdmin or #Principal or #AdmissionCounsellor) true;
      case _ false;
    };
  };

  /// Create a new Lead record from an input payload.
  public func newLead(
    id    : Types.LeadId,
    input : Types.LeadInput,
    now   : Int,
  ) : Types.Lead {
    {
      id;
      name               = input.name;
      phone              = input.phone;
      email              = input.email;
      classInterested    = input.classInterested;
      message            = input.message;
      status             = input.status;
      notes              = input.notes;
      assignedCounsellor = input.assignedCounsellor;
      createdAt          = now;
      updatedAt          = now;
    };
  };

  /// Apply an update payload to an existing Lead, returning the updated record.
  public func applyLeadUpdate(
    existing : Types.Lead,
    input    : Types.LeadInput,
    now      : Int,
  ) : Types.Lead {
    {
      existing with
      name               = input.name;
      phone              = input.phone;
      email              = input.email;
      classInterested    = input.classInterested;
      message            = input.message;
      status             = input.status;
      notes              = input.notes;
      assignedCounsellor = input.assignedCounsellor;
      updatedAt          = now;
    };
  };

  /// Convert a Lead to a flat export row for CSV generation.
  public func toExportRow(lead : Types.Lead) : Types.LeadExportRow {
    {
      id                 = lead.id;
      name               = lead.name;
      phone              = lead.phone;
      email              = lead.email;
      classInterested    = lead.classInterested;
      message            = lead.message;
      status             = statusLabel(lead.status);
      notes              = lead.notes;
      assignedCounsellor = switch (lead.assignedCounsellor) {
        case (?p) p.toText();
        case null "";
      };
      createdAt          = lead.createdAt;
      updatedAt          = lead.updatedAt;
    };
  };

  /// Returns true if two LeadStatus variants are equal (use instead of ==).
  public func statusEqual(a : Types.LeadStatus, b : Types.LeadStatus) : Bool {
    switch (a, b) {
      case (#New, #New)               true;
      case (#Contacted, #Contacted)   true;
      case (#FollowUp, #FollowUp)     true;
      case (#Converted, #Converted)   true;
      case (#Rejected, #Rejected)     true;
      case _                          false;
    };
  };

  /// Returns a human-readable label for a LeadStatus.
  public func statusLabel(status : Types.LeadStatus) : Text {
    switch status {
      case (#New)        "New";
      case (#Contacted)  "Contacted";
      case (#FollowUp)   "Follow Up";
      case (#Converted)  "Converted";
      case (#Rejected)   "Rejected";
    };
  };
};
