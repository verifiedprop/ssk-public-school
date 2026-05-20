import CommonTypes "common";

module {
  public type Difficulty = {
    #Easy;
    #Medium;
    #Hard;
  };

  public type QuestionOption = {
    id   : Text;
    text : Text;
  };

  public type Question = {
    id              : Text;
    text            : Text;
    options         : [QuestionOption];
    correctOptionId : Text;
    marks           : Nat;
    negativeMarking : Bool;
    negativePenalty : Float;
    difficulty      : Difficulty;
  };

  public type QuestionInput = {
    text            : Text;
    options         : [QuestionOption];
    correctOptionId : Text;
    marks           : Nat;
    negativeMarking : Bool;
    negativePenalty : Float;
    difficulty      : Difficulty;
  };

  public type TestStatus = {
    #Draft;
    #Published;
    #Closed;
  };

  public type MockTest = {
    id                    : Text;
    title                 : Text;
    className             : Text;
    subject               : Text;
    totalMarks            : Nat;
    durationMinutes       : Nat;
    passingPercentage     : Float;
    negativeMarkingEnabled: Bool;
    status                : TestStatus;
    questionIds           : [Text];
    createdAt             : CommonTypes.Timestamp;
  };

  public type MockTestInput = {
    title                 : Text;
    className             : Text;
    subject               : Text;
    totalMarks            : Nat;
    durationMinutes       : Nat;
    passingPercentage     : Float;
    negativeMarkingEnabled: Bool;
  };

  public type TestAttempt = {
    id           : Text;
    testId       : Text;
    studentId    : Text;
    studentName  : Text;
    className    : Text;
    answers      : [(Text, Text)];
    marksObtained: Float;
    percentage   : Float;
    passed       : Bool;
    timeTaken    : Nat;
    submittedAt  : CommonTypes.Timestamp;
  };

  public type TestAttemptInput = {
    testId    : Text;
    answers   : [(Text, Text)];
    timeTaken : Nat;
  };
};
