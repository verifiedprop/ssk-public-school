import Types      "../types/school";

module {
  /// Returns true if the caller's role may manage students.
  public func canManageStudents(role : Types.Role) : Bool {
    switch role {
      case (#SuperAdmin or #Principal) true;
      case _ false;
    };
  };

  /// Create a new Student record from an input payload.
  public func newStudent(
    id    : Types.StudentId,
    input : Types.StudentInput,
    now   : Int,
  ) : Types.Student {
    {
      id;
      name          = input.name;
      className     = input.className;
      section       = input.section;
      rollNumber    = input.rollNumber;
      dateOfBirth   = input.dateOfBirth;
      parentName    = input.parentName;
      parentPhone   = input.parentPhone;
      parentEmail   = input.parentEmail;
      address       = input.address;
      photoUrl      = input.photoUrl;
      admissionDate = input.admissionDate;
      isActive      = input.isActive;
      createdAt     = now;
      updatedAt     = now;
    };
  };

  /// Apply an update payload to an existing Student, returning the updated record.
  public func applyStudentUpdate(
    existing : Types.Student,
    input    : Types.StudentInput,
    now      : Int,
  ) : Types.Student {
    {
      existing with
      name          = input.name;
      className     = input.className;
      section       = input.section;
      rollNumber    = input.rollNumber;
      dateOfBirth   = input.dateOfBirth;
      parentName    = input.parentName;
      parentPhone   = input.parentPhone;
      parentEmail   = input.parentEmail;
      address       = input.address;
      photoUrl      = input.photoUrl;
      admissionDate = input.admissionDate;
      isActive      = input.isActive;
      updatedAt     = now;
    };
  };
};
