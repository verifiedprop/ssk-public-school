import List       "mo:core/List";
import Map        "mo:core/Map";
import Types      "types/school";

import AuthMixin       "mixins/auth-api";
import StudentsMixin   "mixins/students-api";
import LeadsMixin      "mixins/leads-api";
import DashboardMixin  "mixins/dashboard-api";
import FeesMixin       "mixins/fees-api";
import SalaryMixin     "mixins/salary-api";
import AttendanceMixin "mixins/attendance-api";
import ResultsMixin    "mixins/results-api";
import TestsMixin      "mixins/tests-api";
import FinanceMixin    "mixins/finance-api";
import ParentMixin     "mixins/parent-api";
import StudentMixin    "mixins/student-api";
import TeacherMixin    "mixins/teacher-api";
import QRAttMixin      "mixins/qr-attendance-api";
import IDCardMixin     "mixins/idcard-api";
import FeeTypes        "types/fees";
import SalaryTypes     "types/salary";
import AttTypes        "types/attendance";
import ResultTypes     "types/results";
import TestTypes       "types/tests";
import FinanceTypes    "types/finance";
import Text        "mo:core/Text";


actor self {
  // ── Stable state ────────────────────────────────────────────────────────────
  let students  : List.List<Types.Student>                    = List.empty<Types.Student>();
  let leads     : List.List<Types.Lead>                       = List.empty<Types.Lead>();
  let users     : Map.Map<Principal, Types.UserProfile>       = Map.empty<Principal, Types.UserProfile>();
  let superAdmin : { var value : ?Principal }                 = { var value = null };
  let counters   : { var nextStudentId : Nat; var nextLeadId : Nat } =
    { var nextStudentId = 1; var nextLeadId = 1 };

  // ── Phase 2 stable state ───────────────────────────────────────────────────
  let fees            : List.List<FeeTypes.FeePayment>            = List.empty<FeeTypes.FeePayment>();
  let feeCounters     : { var nextFeeId : Nat; var nextReceiptId : Nat } =
    { var nextFeeId = 1; var nextReceiptId = 1 };

  let teachers        : List.List<SalaryTypes.TeacherRecord>      = List.empty<SalaryTypes.TeacherRecord>();
  let salaryRecords   : List.List<SalaryTypes.SalaryRecord>       = List.empty<SalaryTypes.SalaryRecord>();
  let salaryCounters  : { var nextTeacherId : Nat; var nextSalaryId : Nat } =
    { var nextTeacherId = 1; var nextSalaryId = 1 };

  let attendanceRecords : List.List<AttTypes.AttendanceRecord>    = List.empty<AttTypes.AttendanceRecord>();
  let attCounters       : { var nextAttendanceId : Nat }          = { var nextAttendanceId = 1 };

  let examResults       : List.List<ResultTypes.ExamResult>       = List.empty<ResultTypes.ExamResult>();
  let resultCounters    : { var nextResultId : Nat }              = { var nextResultId = 1 };

  let questions         : List.List<TestTypes.Question>           = List.empty<TestTypes.Question>();
  let mockTests         : List.List<TestTypes.MockTest>           = List.empty<TestTypes.MockTest>();
  let testAttempts      : List.List<TestTypes.TestAttempt>        = List.empty<TestTypes.TestAttempt>();
  let testCounters      : { var nextTestId : Nat; var nextQuestionId : Nat; var nextAttemptId : Nat } =
    { var nextTestId = 1; var nextQuestionId = 1; var nextAttemptId = 1 };

  let transactions      : List.List<FinanceTypes.Transaction>     = List.empty<FinanceTypes.Transaction>();
  let financeCounters   : { var nextTransactionId : Nat }         = { var nextTransactionId = 1 };

  // ── Phase 3 stable state ───────────────────────────────────────────────────
  let qrSessions : Map.Map<Text, Types.QRSession>            = Map.empty<Text, Types.QRSession>();

  // ── Role resolver helper (closure injected into mixins) ────────────────────
  transient let resolveRole : (Principal) -> ?Types.Role =
    func(p : Principal) : ?Types.Role {
      switch (users.get(p)) {
        case (?profile) ?profile.role;
        case null       null;
      };
    };

  // ── Password store (username → password) ────────────────────────────────
  let passwords : Map.Map<Text, Text> = Map.empty<Text, Text>();

  // Seed demo passwords on first use
  transient let demoPasswords : [(Text, Text)] = [
    ("superadmin",  "admin123"),
    ("principal",   "principal123"),
    ("accountant",  "account123"),
    ("teacher",     "teacher123"),
    ("parent",      "parent123"),
    ("student",     "student123"),
    ("counsellor",  "counsel123"),
  ];

  // Resolve a user's current password: stored override or demo default
  transient let lookupPassword : (Text) -> ?Text =
    func(username : Text) : ?Text {
      switch (passwords.get(username)) {
        case (?pw)  ?pw;
        case null {
          var found : ?Text = null;
          for ((u, p) in demoPasswords.vals()) {
            if (u == username) { found := ?p };
          };
          found;
        };
      };
    };

  public shared func changePassword(
    username       : Text,
    currentPassword : Text,
    newPassword    : Text,
  ) : async { #ok : Text; #err : Text } {
    if (newPassword == "") {
      return #err("New password cannot be empty");
    };
    switch (lookupPassword(username)) {
      case null    { #err("User not found") };
      case (?stored) {
        if (stored != currentPassword) {
          #err("Current password is incorrect");
        } else {
          passwords.add(username, newPassword);
          #ok("Password changed successfully");
        };
      };
    };
  };

  public shared query func verifyPassword(username : Text, password : Text) : async Bool {
    switch (passwords.get(username)) {
      case (?stored) { stored == password };
      case null {
        // Fall back to hardcoded demo defaults
        var matched = false;
        for ((u, p) in demoPasswords.vals()) {
          if (u == username and p == password) { matched := true };
        };
        matched;
      };
    };
  };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include AuthMixin(users, superAdmin);
  include StudentsMixin(students, counters, resolveRole);
  include LeadsMixin(leads, counters, resolveRole);
  include DashboardMixin(students, leads, resolveRole);
  include FeesMixin(fees, feeCounters, resolveRole);
  include SalaryMixin(teachers, salaryRecords, salaryCounters, resolveRole);
  include AttendanceMixin(attendanceRecords, attCounters, resolveRole);
  include ResultsMixin(examResults, resultCounters, resolveRole);
  include TestsMixin(questions, mockTests, testAttempts, testCounters, resolveRole);
  include FinanceMixin(transactions, financeCounters, resolveRole);

  // ── Phase 3 mixins ────────────────────────────────────────────────────────
  include ParentMixin(attendanceRecords, fees, examResults);
  include StudentMixin(attendanceRecords, examResults, mockTests, testAttempts, testCounters);
  include TeacherMixin(attendanceRecords, attCounters, mockTests, testCounters, salaryRecords);
  include QRAttMixin(qrSessions);
  include IDCardMixin(students);
};

