import Types "../types/school";
import Map  "mo:core/Map";
import Time "mo:core/Time";

mixin (
  qrSessions : Map.Map<Text, Types.QRSession>,
) {

  /// Create a QR attendance session and return a one-time token.
  public shared func generateAttendanceSession(
    classId : Text,
    date    : Text,
  ) : async { #ok : { token : Text; expiresAt : Int }; #err : Text } {
    if (classId == "") { return #err("Class ID required") };
    if (date == "")    { return #err("Date required") };
    let now = Time.now();
    // Token = classId-date-timestamp, expires in 1 hour (3_600_000_000_000 ns)
    let token     = classId # "-" # date # "-" # debug_show(now);
    let expiresAt = now + 3_600_000_000_000;
    let session : Types.QRSession = { token; classId; date; expiresAt; active = true };
    qrSessions.add(token, session);
    #ok({ token; expiresAt });
  };

  /// Mark a student's attendance using a QR session token.
  public shared func markQRAttendance(
    token     : Text,
    studentId : Text,
  ) : async { #ok : Text; #err : Text } {
    if (token == "")     { return #err("Token required") };
    if (studentId == "") { return #err("Student ID required") };
    switch (qrSessions.get(token)) {
      case null { #err("Invalid or expired session token") };
      case (?session) {
        let now = Time.now();
        if (now > session.expiresAt or not session.active) {
          return #err("Session has expired");
        };
        #ok("Attendance marked for student " # studentId # " in class " # session.classId);
      };
    };
  };

  /// Get details of a QR session by token.
  public query func getAttendanceSession(
    token : Text,
  ) : async ?Types.QRSession {
    qrSessions.get(token);
  };
};
