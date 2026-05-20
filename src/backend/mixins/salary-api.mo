import List          "mo:core/List";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";
import SalaryTypes   "../types/salary";
import SchoolTypes   "../types/school";
import SalaryLib     "../lib/salary";

mixin (
  teachers        : List.List<SalaryTypes.TeacherRecord>,
  salaryRecords   : List.List<SalaryTypes.SalaryRecord>,
  salaryCounters  : { var nextTeacherId : Nat; var nextSalaryId : Nat },
  userRole        : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func createTeacher(input : SalaryTypes.TeacherInput) : async SalaryTypes.TeacherRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not SalaryLib.canManageSalary(role)) Runtime.trap("Unauthorized");
    let now = Time.now();
    let teacher = SalaryLib.newTeacher(salaryCounters, input, now);
    teachers.add(teacher);
    teacher;
  };

  public shared ({ caller }) func updateTeacher(id : Text, input : SalaryTypes.TeacherInput) : async ?SalaryTypes.TeacherRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not SalaryLib.canManageSalary(role)) Runtime.trap("Unauthorized");
    var updated : ?SalaryTypes.TeacherRecord = null;
    teachers.mapInPlace(func(t) {
      if (t.id == id) {
        let u = SalaryLib.applyTeacherUpdate(t, input);
        updated := ?u;
        u;
      } else t;
    });
    updated;
  };

  public shared query func listTeachers() : async [SalaryTypes.TeacherRecord] {
    teachers.toArray();
  };

  public shared query func getTeacher(id : Text) : async ?SalaryTypes.TeacherRecord {
    teachers.find(func(t) { t.id == id });
  };

  public shared ({ caller }) func createSalaryRecord(input : SalaryTypes.SalaryInput) : async SalaryTypes.SalaryRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not SalaryLib.canManageSalary(role)) Runtime.trap("Unauthorized");
    let teacher = switch (teachers.find(func(t) { t.id == input.teacherId })) {
      case (?t) t;
      case null Runtime.trap("Teacher not found");
    };
    let now = Time.now();
    let record = SalaryLib.generateSalary(salaryCounters, teacher, input, now);
    salaryRecords.add(record);
    record;
  };

  public shared ({ caller }) func updateSalaryRecord(id : Text, input : SalaryTypes.SalaryInput) : async ?SalaryTypes.SalaryRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not SalaryLib.canManageSalary(role)) Runtime.trap("Unauthorized");
    let teacher = switch (teachers.find(func(t) { t.id == input.teacherId })) {
      case (?t) t;
      case null Runtime.trap("Teacher not found");
    };
    let now = Time.now();
    let newRec = SalaryLib.generateSalary(salaryCounters, teacher, input, now);
    var updated : ?SalaryTypes.SalaryRecord = null;
    salaryRecords.mapInPlace(func(s) {
      if (s.id == id) {
        let u = { newRec with id; createdAt = s.createdAt };
        updated := ?u;
        u;
      } else s;
    });
    updated;
  };

  public shared query func listSalaryRecords() : async [SalaryTypes.SalaryRecord] {
    salaryRecords.toArray();
  };

  public shared query func getSalaryByTeacher(teacherId : Text) : async [SalaryTypes.SalaryRecord] {
    salaryRecords.filter(func(s) { s.teacherId == teacherId }).toArray();
  };

  public shared ({ caller }) func markSalaryPaid(id : Text, paidDate : Text, bankDetails : ?Text) : async ?SalaryTypes.SalaryRecord {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not SalaryLib.canManageSalary(role)) Runtime.trap("Unauthorized");
    var updated : ?SalaryTypes.SalaryRecord = null;
    salaryRecords.mapInPlace(func(s) {
      if (s.id == id) {
        let u = SalaryLib.markSalaryPaid(s, paidDate, bankDetails);
        updated := ?u;
        u;
      } else s;
    });
    updated;
  };
};
