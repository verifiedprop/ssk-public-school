import CommonTypes "common";

module {
  public type SalaryStatus = {
    #Pending;
    #Paid;
  };

  public type DeductionType = {
    #Tax;
    #Loan;
    #Insurance;
    #Other;
  };

  public type TeacherRecord = {
    id            : Text;
    name          : Text;
    designation   : Text;
    baseSalary    : Nat;
    dateOfJoining : Text;
    isActive      : Bool;
    createdAt     : CommonTypes.Timestamp;
  };

  public type TeacherInput = {
    name          : Text;
    designation   : Text;
    baseSalary    : Nat;
    dateOfJoining : Text;
  };

  public type SalaryRecord = {
    id              : Text;
    teacherId       : Text;
    teacherName     : Text;
    month           : Text;
    year            : Nat;
    baseSalary      : Nat;
    attendanceBonus : Nat;
    deductions      : Nat;
    netSalary       : Nat;
    status          : SalaryStatus;
    paidDate        : ?Text;
    bankDetails     : ?Text;
    createdAt       : CommonTypes.Timestamp;
  };

  public type SalaryInput = {
    teacherId            : Text;
    month                : Text;
    year                 : Nat;
    attendancePercentage : Float;
    bonusAmount          : Nat;
    deductionAmount      : Nat;
    bankDetails          : ?Text;
  };
};
