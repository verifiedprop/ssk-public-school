import List    "mo:core/List";
import Types   "../types/school";
import StudLib "../lib/students";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

/// Exposes CRUD endpoints for student management.
/// State injected: students list, next-id counter, caller role resolver.
mixin (
  students    : List.List<Types.Student>,
  state       : { var nextStudentId : Nat },
  userRole    : (Principal) -> ?Types.Role,
) {
  /// List all students. Only SuperAdmin / Principal may call.
  public shared query ({ caller }) func listStudents() : async [Types.Student] {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not StudLib.canManageStudents(role)) Runtime.trap("Unauthorized");
    students.toArray();
  };

  /// Get a single student by id.
  public shared query func getStudent(id : Types.StudentId) : async ?Types.Student {
    students.find(func(s) { s.id == id });
  };

  /// Create a new student record.
  public shared ({ caller }) func createStudent(input : Types.StudentInput) : async Types.Student {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not StudLib.canManageStudents(role)) Runtime.trap("Unauthorized");
    let id = state.nextStudentId;
    state.nextStudentId += 1;
    let now = Time.now();
    let student = StudLib.newStudent(id, input, now);
    students.add(student);
    student;
  };

  /// Update an existing student record.
  public shared ({ caller }) func updateStudent(id : Types.StudentId, input : Types.StudentInput) : async ?Types.Student {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not StudLib.canManageStudents(role)) Runtime.trap("Unauthorized");
    let now = Time.now();
    var updated : ?Types.Student = null;
    students.mapInPlace(func(s) {
      if (s.id == id) {
        let u = StudLib.applyStudentUpdate(s, input, now);
        updated := ?u;
        u;
      } else s;
    });
    updated;
  };

  /// Soft-delete (deactivate) a student.
  public shared ({ caller }) func deleteStudent(id : Types.StudentId) : async Bool {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not StudLib.canManageStudents(role)) Runtime.trap("Unauthorized");
    let now = Time.now();
    var found = false;
    students.mapInPlace(func(s) {
      if (s.id == id) {
        found := true;
        { s with isActive = false; updatedAt = now };
      } else s;
    });
    found;
  };
};
