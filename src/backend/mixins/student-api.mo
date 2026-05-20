import AttTypes   "../types/attendance";
import ResultTypes "../types/results";
import TestTypes  "../types/tests";
import List       "mo:core/List";
import Time       "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

mixin (
  attendanceRecords : List.List<AttTypes.AttendanceRecord>,
  examResults       : List.List<ResultTypes.ExamResult>,
  mockTests         : List.List<TestTypes.MockTest>,
  testAttempts      : List.List<TestTypes.TestAttempt>,
  testCounters      : { var nextAttemptId : Nat },
) {

  /// Get this student's own attendance records.
  public query func getMyAttendance(studentId : Text) : async [AttTypes.AttendanceRecord] {
    let now = Time.now();
    if (attendanceRecords.size() == 0) {
      return [
        { id = "1"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 10-A"; date = "2026-05-01"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "2"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 10-A"; date = "2026-05-02"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "3"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 10-A"; date = "2026-05-05"; status = #Absent;  markedBy = "teacher"; createdAt = now },
        { id = "4"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 10-A"; date = "2026-05-06"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "5"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 10-A"; date = "2026-05-07"; status = #Present; markedBy = "teacher"; createdAt = now },
      ];
    };
    attendanceRecords.filter(func(r) { r.attendeeId == studentId }).toArray();
  };

  /// Get this student's own exam results.
  public query func getMyResults(studentId : Text) : async [ResultTypes.ExamResult] {
    let now = Time.now();
    if (examResults.size() == 0) {
      return [
        { id = "res-1"; studentId = studentId; studentName = "Demo Student"; className = "Class 10-A"; examName = "Annual Exam 2026"; subjects = [{ subject = "Mathematics"; marksObtained = 88; totalMarks = 100 }]; totalObtained = 88; totalMaximum = 100; percentage = 88.0; grade = #APlus; createdAt = now },
        { id = "res-2"; studentId = studentId; studentName = "Demo Student"; className = "Class 10-A"; examName = "Annual Exam 2026"; subjects = [{ subject = "Physics";     marksObtained = 76; totalMarks = 100 }]; totalObtained = 76; totalMaximum = 100; percentage = 76.0; grade = #BPlus; createdAt = now },
        { id = "res-3"; studentId = studentId; studentName = "Demo Student"; className = "Class 10-A"; examName = "Annual Exam 2026"; subjects = [{ subject = "Chemistry";  marksObtained = 81; totalMarks = 100 }]; totalObtained = 81; totalMaximum = 100; percentage = 81.0; grade = #APlus; createdAt = now },
        { id = "res-4"; studentId = studentId; studentName = "Demo Student"; className = "Class 10-A"; examName = "Annual Exam 2026"; subjects = [{ subject = "English";    marksObtained = 94; totalMarks = 100 }]; totalObtained = 94; totalMaximum = 100; percentage = 94.0; grade = #APlusPlus; createdAt = now },
      ];
    };
    examResults.filter(func(r) { r.studentId == studentId }).toArray();
  };

  /// Get available mock tests for this student's class.
  public query func getMyTests(studentId : Text) : async [TestTypes.MockTest] {
    ignore studentId;
    let now = Time.now();
    if (mockTests.size() == 0) {
      return [
        { id = "test-1"; title = "Mathematics Practice Test"; className = "Class 10-A"; subject = "Mathematics"; totalMarks = 20; durationMinutes = 30; passingPercentage = 40.0; negativeMarkingEnabled = false; status = #Published; questionIds = []; createdAt = now },
        { id = "test-2"; title = "Physics Chapter 5 Quiz";   className = "Class 10-A"; subject = "Physics";     totalMarks = 30; durationMinutes = 45; passingPercentage = 40.0; negativeMarkingEnabled = true;  status = #Published; questionIds = []; createdAt = now },
        { id = "test-3"; title = "English Grammar Test";     className = "Class 10-A"; subject = "English";     totalMarks = 40; durationMinutes = 60; passingPercentage = 40.0; negativeMarkingEnabled = false; status = #Published; questionIds = []; createdAt = now },
      ];
    };
    mockTests.toArray();
  };

  /// Submit answers for a mock test attempt.
  public shared func submitMyTestAttempt(
    testId  : Text,
    answers : [(Text, Text)],
  ) : async { #ok : { score : Nat; total : Nat; percentage : Float }; #err : Text } {
    if (testId == "") { return #err("Test ID required") };
    if (answers.size() == 0) { return #err("No answers provided") };
    // Demo scoring: award 2 marks per answer up to a total of 20
    let score : Nat = if (answers.size() >= 10) 17 else answers.size() * 2;
    let total : Nat = 20;
    let pct   : Float = (score.toFloat() / total.toFloat()) * 100.0;
    let passed : Bool = pct >= 40.0;
    let attemptId : Text = "attempt-" # testCounters.nextAttemptId.toText();
    testAttempts.add({
      id            = attemptId;
      testId        = testId;
      studentId     = "demo-student";
      studentName   = "Demo Student";
      className     = "Class 10-A";
      answers       = answers;
      marksObtained = score.toFloat();
      percentage    = pct;
      passed        = passed;
      timeTaken     = 0;
      submittedAt   = Time.now();
    });
    testCounters.nextAttemptId += 1;
    #ok({ score; total; percentage = pct });
  };

  /// Get assignments for a class.
  public query func getAssignments(classId : Text) : async [{ id : Nat; title : Text; subject : Text; dueDate : Text; description : Text; uploadedBy : Text }] {
    ignore classId;
    [
      { id = 1; title = "Chapter 5 Exercise";        subject = "Mathematics"; dueDate = "2026-05-25"; description = "Complete exercises 5.1 to 5.4";              uploadedBy = "Mr. Sharma" },
      { id = 2; title = "Lab Report: Acid-Base";     subject = "Chemistry";   dueDate = "2026-05-22"; description = "Write a detailed lab report on acid-base reactions"; uploadedBy = "Mrs. Patel" },
      { id = 3; title = "Essay: My Role Model";      subject = "English";     dueDate = "2026-05-20"; description = "Write a 500-word essay on your role model"; uploadedBy = "Ms. Gupta" },
      { id = 4; title = "Chapter 8 Questions";       subject = "Physics";     dueDate = "2026-05-28"; description = "Answer all questions at the end of chapter 8"; uploadedBy = "Mr. Singh" },
    ];
  };

  /// Get school notices (student view).
  public query func getStudentNotices() : async [{ id : Nat; title : Text; content : Text; date : Text; category : Text }] {
    [
      { id = 1; title = "Annual Sports Day";          content = "Annual Sports Day will be held on 25th May 2026. Participation is mandatory."; date = "2026-05-12"; category = "Event" },
      { id = 2; title = "Mock Test Schedule";         content = "Mock tests for Class 10 will be conducted from 26th May to 2nd June 2026."; date = "2026-05-10"; category = "Exam" },
      { id = 3; title = "Library Books Return";       content = "All library books must be returned by 30th May 2026."; date = "2026-05-08"; category = "Library" },
      { id = 4; title = "Holiday Notice";             content = "School will remain closed on 19th May 2026 due to a public holiday."; date = "2026-05-07"; category = "Holiday" },
    ];
  };
};
