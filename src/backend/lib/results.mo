import List          "mo:core/List";
import Float         "mo:core/Float";
import Nat           "mo:core/Nat";
import ResultTypes   "../types/results";

module {
  /// Compute total marks from an array of SubjectMark.
  public func totals(subjects : [ResultTypes.SubjectMark]) : (Nat, Nat) {
    var obtained : Nat = 0;
    var maximum  : Nat = 0;
    for (s in subjects.values()) {
      obtained += s.marksObtained;
      maximum  += s.totalMarks;
    };
    (obtained, maximum);
  };

  /// Determine grade from percentage.
  public func computeGrade(pct : Float) : ResultTypes.Grade {
    if      (pct >= 95.0) { #APlusPlus }
    else if (pct >= 90.0) { #APlus     }
    else if (pct >= 80.0) { #A         }
    else if (pct >= 70.0) { #BPlus     }
    else if (pct >= 60.0) { #B         }
    else if (pct >= 50.0) { #CPlus     }
    else if (pct >= 40.0) { #C         }
    else if (pct >= 33.0) { #D         }
    else                  { #F         };
  };

  /// Create a new ExamResult.
  public func newResult(
    counter  : { var nextResultId : Nat },
    input    : ResultTypes.ExamResultInput,
    now      : Int,
  ) : ResultTypes.ExamResult {
    let id = "RES-" # counter.nextResultId.toText();
    counter.nextResultId += 1;
    let (obtained, maximum) = totals(input.subjects);
    let pct : Float = if (maximum == 0) { 0.0 } else {
      obtained.toFloat() / maximum.toFloat() * 100.0
    };
    {
      id;
      studentId     = input.studentId;
      studentName   = input.studentName;
      className     = input.className;
      examName      = input.examName;
      subjects      = input.subjects;
      totalObtained = obtained;
      totalMaximum  = maximum;
      percentage    = pct;
      grade         = computeGrade(pct);
      createdAt     = now;
    };
  };

  /// Apply an update to an existing ExamResult.
  public func applyResultUpdate(
    existing : ResultTypes.ExamResult,
    input    : ResultTypes.ExamResultInput,
  ) : ResultTypes.ExamResult {
    let (obtained, maximum) = totals(input.subjects);
    let pct : Float = if (maximum == 0) { 0.0 } else {
      obtained.toFloat() / maximum.toFloat() * 100.0
    };
    {
      existing with
      studentId   = input.studentId;
      studentName = input.studentName;
      className   = input.className;
      examName    = input.examName;
      subjects    = input.subjects;
      totalObtained = obtained;
      totalMaximum  = maximum;
      percentage    = pct;
      grade         = computeGrade(pct);
    };
  };

  /// Return top N results by percentage for a given exam + class.
  public func getToppers(
    results   : List.List<ResultTypes.ExamResult>,
    examName  : Text,
    className : Text,
    topN      : Nat,
  ) : [ResultTypes.ExamResult] {
    let filtered = results.filter(func(r) {
      r.examName == examName and r.className == className
    });
    let sorted = filtered.sort(func(a, b) {
      if      (a.percentage > b.percentage) { #less    }
      else if (a.percentage < b.percentage) { #greater }
      else                                  { #equal   };
    });
    let arr = sorted.toArray();
    if (arr.size() <= topN) { arr } else {
      arr.sliceToArray(0, topN);
    };
  };
};
