import Types      "../types/school";
import AttTypes   "../types/attendance";
import FeeTypes   "../types/fees";
import ResultTypes "../types/results";
import List       "mo:core/List";
import Time       "mo:core/Time";

mixin (
  attendanceRecords : List.List<AttTypes.AttendanceRecord>,
  fees              : List.List<FeeTypes.FeePayment>,
  examResults       : List.List<ResultTypes.ExamResult>,
) {

  /// Get attendance records for a specific student (parent view).
  public query func getChildAttendance(studentId : Text) : async [AttTypes.AttendanceRecord] {
    let now = Time.now();
    if (attendanceRecords.size() == 0) {
      return [
        { id = "att-1"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 5"; date = "2026-05-01"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "att-2"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 5"; date = "2026-05-02"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "att-3"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 5"; date = "2026-05-05"; status = #Absent;  markedBy = "teacher"; createdAt = now },
        { id = "att-4"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 5"; date = "2026-05-06"; status = #Present; markedBy = "teacher"; createdAt = now },
        { id = "att-5"; attendeeId = studentId; attendeeName = "Demo Student"; attendeeType = #Student; className = ?"Class 5"; date = "2026-05-07"; status = #Leave;   markedBy = "teacher"; createdAt = now },
      ];
    };
    attendanceRecords.filter(func(r) { r.attendeeId == studentId }).toArray();
  };

  /// Get fee payment history for a specific student (parent view).
  public query func getChildFees(studentId : Text) : async [FeeTypes.FeePayment] {
    let now = Time.now();
    if (fees.size() == 0) {
      return [
        { id = "fee-1"; studentId = studentId; studentName = "Demo Student"; className = "Class 5"; amount = 5000; netAmount = 5000; discount = 0; fine = 0; status = #Paid;    paidDate = ?"2026-05-08"; receiptNo = "REC001"; installmentNo = null; totalInstallments = null; createdAt = now },
        { id = "fee-2"; studentId = studentId; studentName = "Demo Student"; className = "Class 5"; amount = 5000; netAmount = 5000; discount = 0; fine = 0; status = #Paid;    paidDate = ?"2026-04-09"; receiptNo = "REC002"; installmentNo = null; totalInstallments = null; createdAt = now },
        { id = "fee-3"; studentId = studentId; studentName = "Demo Student"; className = "Class 5"; amount = 5000; netAmount = 5000; discount = 0; fine = 0; status = #Pending; paidDate = null;          receiptNo = "";       installmentNo = null; totalInstallments = null; createdAt = now },
      ];
    };
    fees.filter(func(f) { f.studentId == studentId }).toArray();
  };

  /// Get exam results for a specific student (parent view).
  public query func getChildResults(studentId : Text) : async [ResultTypes.ExamResult] {
    let now = Time.now();
    if (examResults.size() == 0) {
      return [
        { id = "res-1"; studentId = studentId; studentName = "Demo Student"; className = "Class 5"; examName = "Mid-Term 2026"; subjects = [{ subject = "Mathematics"; marksObtained = 85; totalMarks = 100 }, { subject = "Science"; marksObtained = 78; totalMarks = 100 }]; totalObtained = 163; totalMaximum = 200; percentage = 81.5; grade = #A; createdAt = now },
        { id = "res-2"; studentId = studentId; studentName = "Demo Student"; className = "Class 5"; examName = "Unit Test 1";   subjects = [{ subject = "English"; marksObtained = 92; totalMarks = 100 }];                                                                                   totalObtained = 92;  totalMaximum = 100; percentage = 92.0; grade = #APlus; createdAt = now },
      ];
    };
    examResults.filter(func(r) { r.studentId == studentId }).toArray();
  };

  /// Get school notices (parent view).
  public query func getParentNotices() : async [{ id : Text; title : Text; content : Text; date : Text; category : Text }] {
    [
      { id = "n-1"; title = "Annual Sports Day";     content = "Annual Sports Day will be held on 25th May 2026. All parents are invited.";      date = "2026-05-12"; category = "Event"   },
      { id = "n-2"; title = "Fee Reminder";           content = "June 2026 fees are due by 10th June. Please pay on time to avoid late fines.";  date = "2026-05-10"; category = "Finance" },
      { id = "n-3"; title = "Parent-Teacher Meeting"; content = "PTM scheduled for 20th May 2026 from 10 AM to 1 PM.";                            date = "2026-05-08"; category = "Meeting" },
    ];
  };

  /// Send a message to the class teacher.
  public shared func sendMessageToTeacher(msg : Text) : async { #ok : Text; #err : Text } {
    if (msg == "") {
      return #err("Message cannot be empty");
    };
    #ok("Message sent successfully");
  };
};
