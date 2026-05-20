import List   "mo:core/List";
import Types  "../types/school";
import Common "../types/common";

module {
  /// Compute dashboard analytics from the current students and leads lists.
  public func computeStats(
    students    : List.List<Types.Student>,
    leads       : List.List<Types.Lead>,
    dayStartNs  : Common.Timestamp,
  ) : Types.DashboardStats {
    let totalStudents  = students.size();
    let activeStudents = students.foldLeft(0, func(acc, s) = if (s.isActive) acc + 1 else acc);

    let totalLeads     = leads.size();
    var newLeads       = 0;
    var contactedLeads = 0;
    var followUpLeads  = 0;
    var convertedLeads = 0;
    var rejectedLeads  = 0;
    var newLeadsToday  = 0;

    leads.forEach(func(lead) {
      switch (lead.status) {
        case (#New)        { newLeads       += 1 };
        case (#Contacted)  { contactedLeads += 1 };
        case (#FollowUp)   { followUpLeads  += 1 };
        case (#Converted)  { convertedLeads += 1 };
        case (#Rejected)   { rejectedLeads  += 1 };
      };
      if (lead.createdAt >= dayStartNs) { newLeadsToday += 1 };
    });

    {
      totalStudents;
      activeStudents;
      totalLeads;
      newLeads;
      contactedLeads;
      followUpLeads;
      convertedLeads;
      rejectedLeads;
      newLeadsToday;
    };
  };
};
