import List          "mo:core/List";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";
import ResultTypes   "../types/results";
import SchoolTypes   "../types/school";
import ResultsLib    "../lib/results";

mixin (
  examResults    : List.List<ResultTypes.ExamResult>,
  resultCounters : { var nextResultId : Nat },
  userRole       : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func createResult(input : ResultTypes.ExamResultInput) : async ResultTypes.ExamResult {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    let now = Time.now();
    let result = ResultsLib.newResult(resultCounters, input, now);
    examResults.add(result);
    result;
  };

  public shared ({ caller }) func updateResult(id : Text, input : ResultTypes.ExamResultInput) : async ?ResultTypes.ExamResult {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    ignore role;
    var updated : ?ResultTypes.ExamResult = null;
    examResults.mapInPlace(func(r) {
      if (r.id == id) {
        let u = ResultsLib.applyResultUpdate(r, input);
        updated := ?u;
        u;
      } else r;
    });
    updated;
  };

  public shared query func getResult(id : Text) : async ?ResultTypes.ExamResult {
    examResults.find(func(r) { r.id == id });
  };

  public shared query func listResults() : async [ResultTypes.ExamResult] {
    examResults.toArray();
  };

  public shared query func getResultsByStudent(studentId : Text) : async [ResultTypes.ExamResult] {
    examResults.filter(func(r) { r.studentId == studentId }).toArray();
  };

  public shared query func getResultsByExam(examName : Text) : async [ResultTypes.ExamResult] {
    examResults.filter(func(r) { r.examName == examName }).toArray();
  };

  public shared query func getToppers(examName : Text, className : Text) : async [ResultTypes.ExamResult] {
    ResultsLib.getToppers(examResults, examName, className, 5);
  };
};
