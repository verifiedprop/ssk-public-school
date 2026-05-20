import List              "mo:core/List";
import Float             "mo:core/Float";
import Nat               "mo:core/Nat";
import AttendanceTypes   "../types/attendance";

module {
  /// Deduplicate: returns existing record id if attendeeId+date already marked.
  public func findExisting(
    records    : List.List<AttendanceTypes.AttendanceRecord>,
    attendeeId : Text,
    date       : Text,
  ) : ?AttendanceTypes.AttendanceRecord {
    records.find(func(r) { r.attendeeId == attendeeId and r.date == date });
  };

  /// Build a new AttendanceRecord.
  public func newRecord(
    counter  : { var nextAttendanceId : Nat },
    input    : AttendanceTypes.AttendanceInput,
    markedBy : Text,
    now      : Int,
  ) : AttendanceTypes.AttendanceRecord {
    let id = "ATT-" # counter.nextAttendanceId.toText();
    counter.nextAttendanceId += 1;
    {
      id;
      attendeeId   = input.attendeeId;
      attendeeName = input.attendeeName;
      attendeeType = input.attendeeType;
      className    = input.className;
      date         = input.date;
      status       = input.status;
      markedBy;
      createdAt    = now;
    };
  };

  /// Compute summary for one attendee across all their records.
  public func computeSummary(
    records    : List.List<AttendanceTypes.AttendanceRecord>,
    attendeeId : Text,
  ) : ?AttendanceTypes.AttendanceSummary {
    let mine = records.filter(func(r) { r.attendeeId == attendeeId });
    if (mine.size() == 0) return null;
    var presentCount : Nat = 0;
    var absentCount  : Nat = 0;
    var leaveCount   : Nat = 0;
    var nameFound    : Text = "";
    var classFound   : ?Text = null;
    mine.forEach(func(r) {
      nameFound  := r.attendeeName;
      classFound := r.className;
      switch (r.status) {
        case (#Present) { presentCount += 1 };
        case (#Absent)  { absentCount  += 1 };
        case (#Leave)   { leaveCount   += 1 };
      };
    });
    let total = presentCount + absentCount + leaveCount;
    let pct : Float = if (total == 0) { 0.0 } else {
      presentCount.toFloat() / total.toFloat() * 100.0
    };
    ?{
      attendeeId;
      attendeeName = nameFound;
      className    = classFound;
      totalDays    = total;
      present      = presentCount;
      absent       = absentCount;
      leave        = leaveCount;
      percentage   = pct;
    };
  };
};
