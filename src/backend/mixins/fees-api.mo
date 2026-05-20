import List        "mo:core/List";
import Time        "mo:core/Time";
import Runtime     "mo:core/Runtime";
import FeeTypes    "../types/fees";
import SchoolTypes "../types/school";
import FeesLib     "../lib/fees";

mixin (
  fees        : List.List<FeeTypes.FeePayment>,
  feeCounters : { var nextFeeId : Nat; var nextReceiptId : Nat },
  userRole    : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func createFeePayment(input : FeeTypes.FeePaymentInput) : async FeeTypes.FeePayment {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not FeesLib.canManageFees(role)) Runtime.trap("Unauthorized");
    let now = Time.now();
    let payment = FeesLib.newFeePayment(feeCounters, input, now);
    fees.add(payment);
    payment;
  };

  public shared ({ caller }) func updateFeePayment(id : Text, input : FeeTypes.FeePaymentInput) : async ?FeeTypes.FeePayment {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not FeesLib.canManageFees(role)) Runtime.trap("Unauthorized");
    var updated : ?FeeTypes.FeePayment = null;
    fees.mapInPlace(func(f) {
      if (f.id == id) {
        let u = FeesLib.applyFeeUpdate(f, input);
        updated := ?u;
        u;
      } else f;
    });
    updated;
  };

  public shared query func getFeePayment(id : Text) : async ?FeeTypes.FeePayment {
    fees.find(func(f) { f.id == id });
  };

  public shared query func listFeePayments() : async [FeeTypes.FeePayment] {
    fees.toArray();
  };

  public shared query func listPendingFees() : async [FeeTypes.FeePayment] {
    fees.filter(FeesLib.isPending).toArray();
  };

  public shared query func getFeesByStudent(studentId : Text) : async [FeeTypes.FeePayment] {
    fees.filter(func(f) { f.studentId == studentId }).toArray();
  };

  public shared ({ caller }) func markFeePaid(id : Text, paidDate : Text) : async ?FeeTypes.FeePayment {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    if (not FeesLib.canManageFees(role)) Runtime.trap("Unauthorized");
    var updated : ?FeeTypes.FeePayment = null;
    fees.mapInPlace(func(f) {
      if (f.id == id) {
        let u = FeesLib.markPaid(f, paidDate);
        updated := ?u;
        u;
      } else f;
    });
    updated;
  };
};
