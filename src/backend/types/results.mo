import CommonTypes "common";

module {
  public type Grade = {
    #APlusPlus;
    #APlus;
    #A;
    #BPlus;
    #B;
    #CPlus;
    #C;
    #D;
    #F;
  };

  public type SubjectMark = {
    subject       : Text;
    marksObtained : Nat;
    totalMarks    : Nat;
  };

  public type ExamResult = {
    id            : Text;
    studentId     : Text;
    studentName   : Text;
    className     : Text;
    examName      : Text;
    subjects      : [SubjectMark];
    totalObtained : Nat;
    totalMaximum  : Nat;
    percentage    : Float;
    grade         : Grade;
    createdAt     : CommonTypes.Timestamp;
  };

  public type ExamResultInput = {
    studentId   : Text;
    studentName : Text;
    className   : Text;
    examName    : Text;
    subjects    : [SubjectMark];
  };
};
