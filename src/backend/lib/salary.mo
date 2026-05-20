import Nat          "mo:core/Nat";
import Float        "mo:core/Float";
import Time         "mo:core/Time";
import SalaryTypes  "../types/salary";
import Int "mo:core/Int";

module {
  public func canManageSalary(role : { #SuperAdmin; #Principal; #Accountant; #Teacher; #Parent; #Student; #AdmissionCounsellor }) : Bool {
    switch role {
      case (#SuperAdmin or #Principal or #Accountant) true;
      case _ false;
    };
  };

  /// Create a new TeacherRecord.
  public func newTeacher(
    counter : { var nextTeacherId : Nat },
    input   : SalaryTypes.TeacherInput,
    now     : Int,
  ) : SalaryTypes.TeacherRecord {
    let id = "TCH-" # counter.nextTeacherId.toText();
    counter.nextTeacherId += 1;
    {
      id;
      name          = input.name;
      designation   = input.designation;
      baseSalary    = input.baseSalary;
      dateOfJoining = input.dateOfJoining;
      isActive      = true;
      createdAt     = now;
    };
  };

  /// Apply an update to an existing TeacherRecord.
  public func applyTeacherUpdate(
    existing : SalaryTypes.TeacherRecord,
    input    : SalaryTypes.TeacherInput,
  ) : SalaryTypes.TeacherRecord {
    {
      existing with
      name          = input.name;
      designation   = input.designation;
      baseSalary    = input.baseSalary;
      dateOfJoining = input.dateOfJoining;
    };
  };

  /// Generate a new SalaryRecord.
  /// netSalary = baseSalary * (attendancePercentage/100) + bonusAmount - deductionAmount
  public func generateSalary(
    counter   : { var nextSalaryId : Nat },
    teacher   : SalaryTypes.TeacherRecord,
    input     : SalaryTypes.SalaryInput,
    now       : Int,
  ) : SalaryTypes.SalaryRecord {
    let id = "SAL-" # counter.nextSalaryId.toText();
    counter.nextSalaryId += 1;
    let baseFloat  = teacher.baseSalary.toFloat();
    let pct        = input.attendancePercentage / 100.0;
    let computed   = baseFloat * pct;
    let bonusFloat = input.bonusAmount.toFloat();
    let dedFloat   = input.deductionAmount.toFloat();
    let netFloat   = computed + bonusFloat - dedFloat;
    let netSalary  : Nat = if (netFloat < 0.0) { 0 } else {
      Int.abs(netFloat.toInt())
    };
    {
      id;
      teacherId       = teacher.id;
      teacherName     = teacher.name;
      month           = input.month;
      year            = input.year;
      baseSalary      = teacher.baseSalary;
      attendanceBonus = input.bonusAmount;
      deductions      = input.deductionAmount;
      netSalary;
      status          = #Pending;
      paidDate        = null;
      bankDetails     = input.bankDetails;
      createdAt       = now;
    };
  };

  /// Mark a salary record as paid.
  public func markSalaryPaid(
    existing    : SalaryTypes.SalaryRecord,
    paidDate    : Text,
    bankDetails : ?Text,
  ) : SalaryTypes.SalaryRecord {
    let bd = switch bankDetails {
      case (?b) ?b;
      case null  existing.bankDetails;
    };
    { existing with status = #Paid; paidDate = ?paidDate; bankDetails = bd };
  };
};
