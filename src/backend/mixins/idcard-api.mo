import Types "../types/school";
import List  "mo:core/List";
import Time  "mo:core/Time";

mixin (
  students : List.List<Types.Student>,
) {

  /// Get student information formatted for ID card generation.
  public query func getStudentCard(studentId : Text) : async ?Types.StudentCard {
    // Try to find in live state first
    let found = students.find(func(s) {
      debug_show(s.id) == studentId or s.rollNumber == studentId
    });
    switch (found) {
      case (?s) {
        ?{
          studentId     = debug_show(s.id);
          name          = s.name;
          className     = s.className;
          section       = s.section;
          rollNumber    = s.rollNumber;
          dateOfBirth   = s.dateOfBirth;
          parentName    = s.parentName;
          parentPhone   = s.parentPhone;
          photoUrl      = s.photoUrl;
          admissionYear = "2024";
          schoolName    = "SSK Public School";
          schoolAddress = "123 Education Lane, Knowledge City";
          academicYear  = "2025-2026";
        };
      };
      case null {
        // Return demo card when no students are seeded yet
        if (studentId == "") { null } else {
          ?{
            studentId     = studentId;
            name          = "Demo Student";
            className     = "Class 10";
            section       = "A";
            rollNumber    = studentId;
            dateOfBirth   = "2010-06-15";
            parentName    = "Demo Parent";
            parentPhone   = "+91-9876543210";
            photoUrl      = "";
            admissionYear = "2022";
            schoolName    = "SSK Public School";
            schoolAddress = "123 Education Lane, Knowledge City";
            academicYear  = "2025-2026";
          };
        };
      };
    };
  };

  /// List all student cards (for batch ID card printing).
  public query func listStudentCards() : async [Types.StudentCard] {
    let now = Time.now();
    ignore now;
    if (students.size() == 0) {
      return [
        { studentId = "001"; name = "Aarav Sharma";  className = "Class 10"; section = "A"; rollNumber = "001"; dateOfBirth = "2010-04-12"; parentName = "Rajesh Sharma";  parentPhone = "+91-9876543210"; photoUrl = ""; admissionYear = "2022"; schoolName = "SSK Public School"; schoolAddress = "123 Education Lane, Knowledge City"; academicYear = "2025-2026" },
        { studentId = "002"; name = "Priya Singh";   className = "Class 9";  section = "B"; rollNumber = "002"; dateOfBirth = "2011-07-25"; parentName = "Amit Singh";    parentPhone = "+91-9876543211"; photoUrl = ""; admissionYear = "2022"; schoolName = "SSK Public School"; schoolAddress = "123 Education Lane, Knowledge City"; academicYear = "2025-2026" },
        { studentId = "003"; name = "Rohan Patel";   className = "Class 8";  section = "A"; rollNumber = "003"; dateOfBirth = "2012-01-30"; parentName = "Suresh Patel";  parentPhone = "+91-9876543212"; photoUrl = ""; admissionYear = "2023"; schoolName = "SSK Public School"; schoolAddress = "123 Education Lane, Knowledge City"; academicYear = "2025-2026" },
        { studentId = "004"; name = "Ananya Gupta";  className = "Class 7";  section = "C"; rollNumber = "004"; dateOfBirth = "2013-09-18"; parentName = "Vikram Gupta";  parentPhone = "+91-9876543213"; photoUrl = ""; admissionYear = "2023"; schoolName = "SSK Public School"; schoolAddress = "123 Education Lane, Knowledge City"; academicYear = "2025-2026" },
        { studentId = "005"; name = "Karan Mehta";   className = "Class 6";  section = "B"; rollNumber = "005"; dateOfBirth = "2014-03-05"; parentName = "Deepak Mehta";  parentPhone = "+91-9876543214"; photoUrl = ""; admissionYear = "2024"; schoolName = "SSK Public School"; schoolAddress = "123 Education Lane, Knowledge City"; academicYear = "2025-2026" },
      ];
    };
    students.map<Types.Student, Types.StudentCard>(func(s) {
      {
        studentId     = debug_show(s.id);
        name          = s.name;
        className     = s.className;
        section       = s.section;
        rollNumber    = s.rollNumber;
        dateOfBirth   = s.dateOfBirth;
        parentName    = s.parentName;
        parentPhone   = s.parentPhone;
        photoUrl      = s.photoUrl;
        admissionYear = "2024";
        schoolName    = "SSK Public School";
        schoolAddress = "123 Education Lane, Knowledge City";
        academicYear  = "2025-2026";
      }
    }).toArray();
  };
};
