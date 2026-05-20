import List        "mo:core/List";
import Float       "mo:core/Float";
import Nat         "mo:core/Nat";
import Time        "mo:core/Time";
import TestTypes   "../types/tests";

module {
  /// Create a new Question.
  public func newQuestion(
    counter : { var nextQuestionId : Nat },
    input   : TestTypes.QuestionInput,
  ) : TestTypes.Question {
    let id = "QST-" # counter.nextQuestionId.toText();
    counter.nextQuestionId += 1;
    {
      id;
      text            = input.text;
      options         = input.options;
      correctOptionId = input.correctOptionId;
      marks           = input.marks;
      negativeMarking = input.negativeMarking;
      negativePenalty = input.negativePenalty;
      difficulty      = input.difficulty;
    };
  };

  /// Create a new MockTest.
  public func newMockTest(
    counter : { var nextTestId : Nat },
    input   : TestTypes.MockTestInput,
    now     : Int,
  ) : TestTypes.MockTest {
    let id = "TST-" # counter.nextTestId.toText();
    counter.nextTestId += 1;
    {
      id;
      title                  = input.title;
      className              = input.className;
      subject                = input.subject;
      totalMarks             = input.totalMarks;
      durationMinutes        = input.durationMinutes;
      passingPercentage      = input.passingPercentage;
      negativeMarkingEnabled = input.negativeMarkingEnabled;
      status                 = #Draft;
      questionIds            = [];
      createdAt              = now;
    };
  };

  /// Score a test attempt: iterate answers and compute marksObtained.
  public func scoreAttempt(
    questions : List.List<TestTypes.Question>,
    test      : TestTypes.MockTest,
    answers   : [(Text, Text)],  // (questionId, selectedOptionId)
    attemptId : Text,
    studentId : Text,
    studentName : Text,
    className  : Text,
    timeTaken  : Nat,
    now        : Int,
  ) : TestTypes.TestAttempt {
    var marksFloat : Float = 0.0;
    for ((qId, selectedId) in answers.values()) {
      switch (questions.find(func(q) { q.id == qId })) {
        case null {};
        case (?q) {
          if (q.correctOptionId == selectedId) {
            marksFloat += q.marks.toFloat();
          } else if (q.negativeMarking and test.negativeMarkingEnabled) {
            marksFloat -= q.negativePenalty;
          };
        };
      };
    };
    if (marksFloat < 0.0) { marksFloat := 0.0 };
    let pct = if (test.totalMarks == 0) { 0.0 } else {
      marksFloat / test.totalMarks.toFloat() * 100.0
    };
    {
      id           = attemptId;
      testId       = test.id;
      studentId;
      studentName;
      className;
      answers;
      marksObtained = marksFloat;
      percentage    = pct;
      passed        = pct >= test.passingPercentage;
      timeTaken;
      submittedAt   = now;
    };
  };

  /// Sort attempts by marksObtained descending for leaderboard.
  public func leaderboard(
    attempts : List.List<TestTypes.TestAttempt>,
    testId   : Text,
  ) : [TestTypes.TestAttempt] {
    let filtered = attempts.filter(func(a) { a.testId == testId });
    let sorted   = filtered.sort(func(a, b) {
      if      (a.marksObtained > b.marksObtained) { #less    }
      else if (a.marksObtained < b.marksObtained) { #greater }
      else                                         { #equal   };
    });
    sorted.toArray();
  };
};
