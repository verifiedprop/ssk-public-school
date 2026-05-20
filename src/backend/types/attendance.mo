import CommonTypes "common";

module {
  public type AttendanceStatus = {
    #Present;
    #Absent;
    #Leave;
  };

  public type AttendeeType = {
    #Student;
    #Teacher;
  };

  public type AttendanceRecord = {
    id           : Text;
    attendeeId   : Text;
    attendeeName : Text;
    attendeeType : AttendeeType;
    className    : ?Text;
    date         : Text;
    status       : AttendanceStatus;
    markedBy     : Text;
    createdAt    : CommonTypes.Timestamp;
  };

  public type AttendanceInput = {
    attendeeId   : Text;
    attendeeName : Text;
    attendeeType : AttendeeType;
    className    : ?Text;
    date         : Text;
    status       : AttendanceStatus;
  };

  public type AttendanceSummary = {
    attendeeId   : Text;
    attendeeName : Text;
    className    : ?Text;
    totalDays    : Nat;
    present      : Nat;
    absent       : Nat;
    leave        : Nat;
    percentage   : Float;
  };
};
