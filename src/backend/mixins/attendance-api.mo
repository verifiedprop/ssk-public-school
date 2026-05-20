import List               "mo:core/List";
import Time               "mo:core/Time";
import Runtime            "mo:core/Runtime";
import AttendanceTypes    "../types/attendance";
import SchoolTypes        "../types/school";
import AttendanceLib      "../lib/attendance";

mixin (
  attendanceRecords  : List.List<AttendanceTypes.AttendanceRecord>,
  attCounters        : { var nextAttendanceId : Nat },
  userRole           : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func markAttendance(input : AttendanceTypes.AttendanceInput) : async AttendanceTypes.AttendanceRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    let markedBy = caller.toText();
    let now = Time.now();
    // Update existing record if same attendeeId+date, else add new
    switch (AttendanceLib.findExisting(attendanceRecords, input.attendeeId, input.date)) {
      case (?existing) {
        var result = existing;
        attendanceRecords.mapInPlace(func(r) {
          if (r.attendeeId == input.attendeeId and r.date == input.date) {
            let u = { r with status = input.status; markedBy };
            result := u;
            u;
          } else r;
        });
        result;
      };
      case null {
        let record = AttendanceLib.newRecord(attCounters, input, markedBy, now);
        attendanceRecords.add(record);
        record;
      };
    };
  };

  public shared ({ caller }) func bulkMarkAttendance(inputs : [AttendanceTypes.AttendanceInput]) : async [AttendanceTypes.AttendanceRecord] {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    let markedBy = caller.toText();
    let now = Time.now();
    let results = List.empty<AttendanceTypes.AttendanceRecord>();
    for (input in inputs.values()) {
      switch (AttendanceLib.findExisting(attendanceRecords, input.attendeeId, input.date)) {
        case (?_existing) {
          var result = _existing;
          attendanceRecords.mapInPlace(func(r) {
            if (r.attendeeId == input.attendeeId and r.date == input.date) {
              let u = { r with status = input.status; markedBy };
              result := u;
              u;
            } else r;
          });
          results.add(result);
        };
        case null {
          let record = AttendanceLib.newRecord(attCounters, input, markedBy, now);
          attendanceRecords.add(record);
          results.add(record);
        };
      };
    };
    results.toArray();
  };

  public shared query func getAttendance(id : Text) : async ?AttendanceTypes.AttendanceRecord {
    attendanceRecords.find(func(r) { r.id == id });
  };

  public shared query func listAttendance(date : ?Text) : async [AttendanceTypes.AttendanceRecord] {
    switch date {
      case (?d) attendanceRecords.filter(func(r) { r.date == d }).toArray();
      case null attendanceRecords.toArray();
    };
  };

  public shared query func getAttendanceSummary(attendeeId : Text) : async ?AttendanceTypes.AttendanceSummary {
    AttendanceLib.computeSummary(attendanceRecords, attendeeId);
  };

  public shared query func getClassAttendance(className : Text, date : Text) : async [AttendanceTypes.AttendanceRecord] {
    attendanceRecords.filter(func(r) {
      r.date == date and (switch (r.className) { case (?cn) cn == className; case null false })
    }).toArray();
  };
};
