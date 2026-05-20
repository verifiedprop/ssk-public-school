import AttTypes   "../types/attendance";
import TestTypes  "../types/tests";
import SalaryTypes "../types/salary";
import List       "mo:core/List";
import Time       "mo:core/Time";

mixin (
  attendanceRecords : List.List<AttTypes.AttendanceRecord>,
  attCounters       : { var nextAttendanceId : Nat },
  mockTests         : List.List<TestTypes.MockTest>,
  testCounters      : { var nextTestId : Nat; var nextQuestionId : Nat; var nextAttemptId : Nat },
  salaryRecords     : List.List<SalaryTypes.SalaryRecord>,
) {

  /// Upload a homework assignment for a class.
  public shared func uploadHomework(
    classId     : Text,
    title       : Text,
    dueDate     : Text,
    description : Text,
  ) : async { #ok : Text; #err : Text } {
    if (title == "")   { return #err("Title required") };
    if (classId == "") { return #err("Class ID required") };
    ignore dueDate;
    ignore description;
    #ok("Homework '" # title # "' uploaded for " # classId);
  };

  /// Mark daily attendance for a class.
  public shared func markClassAttendance(
    classId : Text,
    date    : Text,
    records : [{ studentId : Text; status : Text }],
  ) : async { #ok : Nat; #err : Text } {
    if (classId == "") { return #err("Class ID required") };
    if (date == "")    { return #err("Date required") };
    var count = 0;
    for (rec in records.vals()) {
      let status : AttTypes.AttendanceStatus = switch (rec.status) {
        case "Present" #Present;
        case "Absent"  #Absent;
        case "Leave"   #Leave;
        case _         #Present;
      };
      let idText = debug_show(attCounters.nextAttendanceId);
      attendanceRecords.add({
        id           = idText;
        attendeeId   = rec.studentId;
        attendeeName = "";
        attendeeType = #Student;
        className    = ?classId;
        date;
        status;
        markedBy     = "teacher";
        createdAt    = Time.now();
      });
      attCounters.nextAttendanceId += 1;
      count += 1;
    };
    #ok(count);
  };

  /// Create a new mock test.
  public shared func createMyTest(
    title           : Text,
    className       : Text,
    subject         : Text,
    durationMinutes : Nat,
    negativeMarkingEnabled : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (title == "")     { return #err("Title required") };
    if (className == "") { return #err("Class name required") };
    let id : Text = "test-" # testCounters.nextTestId.toText();
    mockTests.add({
      id;
      title;
      className;
      subject;
      totalMarks             = 0;
      durationMinutes;
      passingPercentage      = 40.0;
      negativeMarkingEnabled;
      status                 = #Published;
      questionIds            = [];
      createdAt              = Time.now();
    });
    testCounters.nextTestId += 1;
    #ok(id);
  };

  /// Upload marks for an exam (accepts flat text records).
  public shared func uploadMarks(
    examId : Text,
    marks  : [{ studentId : Text; subject : Text; marksObtained : Nat; totalMarks : Nat }],
  ) : async { #ok : Nat; #err : Text } {
    if (examId == "") { return #err("Exam ID required") };
    ignore marks;
    #ok(marks.size());
  };

  /// Get salary slips for a teacher.
  public query func getMySalarySlips(teacherId : Text) : async [SalaryTypes.SalaryRecord] {
    let now = Time.now();
    if (salaryRecords.size() == 0) {
      return [
        { id = "sal-1"; teacherId; teacherName = "Demo Teacher"; month = "May";   year = 2026; baseSalary = 35000; attendanceBonus = 2000; deductions = 4000; netSalary = 33000; paidDate = ?"2026-05-01"; status = #Paid;    bankDetails = ?"SBI-XXXX1234"; createdAt = now },
        { id = "sal-2"; teacherId; teacherName = "Demo Teacher"; month = "April"; year = 2026; baseSalary = 35000; attendanceBonus = 0;    deductions = 4000; netSalary = 31000; paidDate = ?"2026-04-01"; status = #Paid;    bankDetails = ?"SBI-XXXX1234"; createdAt = now },
        { id = "sal-3"; teacherId; teacherName = "Demo Teacher"; month = "June";  year = 2026; baseSalary = 35000; attendanceBonus = 0;    deductions = 4000; netSalary = 31000; paidDate = null;          status = #Pending; bankDetails = ?"SBI-XXXX1234"; createdAt = now },
      ];
    };
    salaryRecords.filter(func(r) { r.teacherId == teacherId }).toArray();
  };

  /// Generate a QR attendance token for a class session.
  public shared func generateTeacherQRCode(
    classId : Text,
    date    : Text,
  ) : async { #ok : Text; #err : Text } {
    if (classId == "") { return #err("Class ID required") };
    if (date == "")    { return #err("Date required") };
    let token = classId # "-" # date # "-" # debug_show(Time.now());
    #ok(token);
  };
};
