import List        "mo:core/List";
import Time        "mo:core/Time";
import Runtime     "mo:core/Runtime";
import Nat         "mo:core/Nat";
import TestTypes   "../types/tests";
import SchoolTypes "../types/school";
import TestsLib    "../lib/tests";
import Array "mo:core/Array";

mixin (
  questions      : List.List<TestTypes.Question>,
  mockTests      : List.List<TestTypes.MockTest>,
  testAttempts   : List.List<TestTypes.TestAttempt>,
  testCounters   : { var nextTestId : Nat; var nextQuestionId : Nat; var nextAttemptId : Nat },
  userRole       : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func createTest(input : TestTypes.MockTestInput) : async TestTypes.MockTest {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    let now = Time.now();
    let test = TestsLib.newMockTest(testCounters, input, now);
    mockTests.add(test);
    test;
  };

  public shared ({ caller }) func updateTest(id : Text, input : TestTypes.MockTestInput) : async ?TestTypes.MockTest {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    var updated : ?TestTypes.MockTest = null;
    mockTests.mapInPlace(func(t) {
      if (t.id == id) {
        let u = {
          t with
          title                  = input.title;
          className              = input.className;
          subject                = input.subject;
          totalMarks             = input.totalMarks;
          durationMinutes        = input.durationMinutes;
          passingPercentage      = input.passingPercentage;
          negativeMarkingEnabled = input.negativeMarkingEnabled;
        };
        updated := ?u;
        u;
      } else t;
    });
    updated;
  };

  public shared query func getTest(id : Text) : async ?TestTypes.MockTest {
    mockTests.find(func(t) { t.id == id });
  };

  public shared query func listTests() : async [TestTypes.MockTest] {
    mockTests.toArray();
  };

  public shared ({ caller }) func addQuestion(testId : Text, input : TestTypes.QuestionInput) : async TestTypes.Question {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    let question = TestsLib.newQuestion(testCounters, input);
    questions.add(question);
    // Append question id to test's questionIds
    mockTests.mapInPlace(func(t) {
      if (t.id == testId) {
        let newIds = t.questionIds.concat([question.id]);
        { t with questionIds = newIds };
      } else t;
    });
    question;
  };

  public shared query func getQuestion(id : Text) : async ?TestTypes.Question {
    questions.find(func(q) { q.id == id });
  };

  public shared query func listQuestions(testId : Text) : async [TestTypes.Question] {
    // Get the test's questionIds then filter questions
    switch (mockTests.find(func(t) { t.id == testId })) {
      case null [];
      case (?test) {
        let ids = test.questionIds;
        questions.filter(func(q) {
          ids.find(func(id) { id == q.id }) != null
        }).toArray();
      };
    };
  };

  public shared ({ caller }) func publishTest(id : Text) : async ?TestTypes.MockTest {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    var updated : ?TestTypes.MockTest = null;
    mockTests.mapInPlace(func(t) {
      if (t.id == id) {
        let u = { t with status = #Published };
        updated := ?u;
        u;
      } else t;
    });
    updated;
  };

  public shared ({ caller }) func submitTestAttempt(input : TestTypes.TestAttemptInput) : async TestTypes.TestAttempt {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    let (studentName, className) = switch role {
      case (#Student) {
        // Use caller principal as studentId context
        (caller.toText(), "");
      };
      case _ (caller.toText(), "");
    };
    let test = switch (mockTests.find(func(t) { t.id == input.testId })) {
      case (?t) t;
      case null Runtime.trap("Test not found");
    };
    let now = Time.now();
    let attemptId = "ATM-" # testCounters.nextAttemptId.toText();
    testCounters.nextAttemptId += 1;
    let attempt = TestsLib.scoreAttempt(
      questions, test, input.answers,
      attemptId, caller.toText(), studentName, className,
      input.timeTaken, now,
    );
    testAttempts.add(attempt);
    attempt;
  };

  public shared query func getTestAttempts(testId : Text) : async [TestTypes.TestAttempt] {
    testAttempts.filter(func(a) { a.testId == testId }).toArray();
  };

  public shared query func getTestLeaderboard(testId : Text) : async [TestTypes.TestAttempt] {
    TestsLib.leaderboard(testAttempts, testId);
  };
};
