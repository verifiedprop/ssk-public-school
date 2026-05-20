import CommonTypes "common";

module {
  public type StudentId = Nat;
  public type LeadId    = Nat;

  /// The 7 roles supported by SSK Public School ERP.
  public type Role = {
    #SuperAdmin;
    #Principal;
    #Accountant;
    #Teacher;
    #Parent;
    #Student;
    #AdmissionCounsellor;
  };

  /// A registered user with a role.
  public type UserProfile = {
    principal : Principal;
    role      : Role;
    name      : Text;
    createdAt : CommonTypes.Timestamp;
  };

  /// Immutable student record (API boundary — no var fields).
  public type Student = {
    id            : StudentId;
    name          : Text;
    className     : Text;
    section       : Text;
    rollNumber    : Text;
    dateOfBirth   : Text;  // ISO-8601 date string
    parentName    : Text;
    parentPhone   : Text;
    parentEmail   : Text;
    address       : Text;
    photoUrl      : Text;
    admissionDate : CommonTypes.Timestamp;
    isActive      : Bool;
    createdAt     : CommonTypes.Timestamp;
    updatedAt     : CommonTypes.Timestamp;
  };

  /// Input payload for creating or updating a student.
  public type StudentInput = {
    name          : Text;
    className     : Text;
    section       : Text;
    rollNumber    : Text;
    dateOfBirth   : Text;
    parentName    : Text;
    parentPhone   : Text;
    parentEmail   : Text;
    address       : Text;
    photoUrl      : Text;
    admissionDate : CommonTypes.Timestamp;
    isActive      : Bool;
  };

  /// Admission lead status lifecycle.
  public type LeadStatus = {
    #New;
    #Contacted;
    #FollowUp;
    #Converted;
    #Rejected;
  };

  /// Immutable admission lead record (API boundary).
  public type Lead = {
    id                 : LeadId;
    name               : Text;
    phone              : Text;
    email              : Text;
    classInterested    : Text;
    message            : Text;
    status             : LeadStatus;
    notes              : Text;
    assignedCounsellor : ?Principal;
    createdAt          : CommonTypes.Timestamp;
    updatedAt          : CommonTypes.Timestamp;
  };

  /// Input payload for creating or updating a lead.
  public type LeadInput = {
    name               : Text;
    phone              : Text;
    email              : Text;
    classInterested    : Text;
    message            : Text;
    status             : LeadStatus;
    notes              : Text;
    assignedCounsellor : ?Principal;
  };

  /// Dashboard analytics snapshot.
  public type DashboardStats = {
    totalStudents  : Nat;
    activeStudents : Nat;
    totalLeads     : Nat;
    newLeads       : Nat;
    contactedLeads : Nat;
    followUpLeads  : Nat;
    convertedLeads : Nat;
    rejectedLeads  : Nat;
    newLeadsToday  : Nat;
  };

  /// Flat row for CSV / Excel export of a lead.
  public type LeadExportRow = {
    id                 : LeadId;
    name               : Text;
    phone              : Text;
    email              : Text;
    classInterested    : Text;
    message            : Text;
    status             : Text;  // human-readable variant label
    notes              : Text;
    assignedCounsellor : Text;  // principal text or empty
    createdAt          : CommonTypes.Timestamp;
    updatedAt          : CommonTypes.Timestamp;
  };
  /// Flat record returned to the frontend for ID card rendering.
  public type StudentCard = {
    studentId     : Text;
    name          : Text;
    className     : Text;
    section       : Text;
    rollNumber    : Text;
    dateOfBirth   : Text;
    parentName    : Text;
    parentPhone   : Text;
    photoUrl      : Text;
    admissionYear : Text;
    schoolName    : Text;
    schoolAddress : Text;
    academicYear  : Text;
  };

  /// QR attendance session state: token -> (classId, date, expiresAt)
  public type QRSession = {
    token     : Text;
    classId   : Text;
    date      : Text;
    expiresAt : Int;  // nanoseconds timestamp
    active    : Bool;
  };
};
