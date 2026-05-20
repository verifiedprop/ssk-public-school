import List        "mo:core/List";
import Float       "mo:core/Float";
import Nat         "mo:core/Nat";
import Time        "mo:core/Time";
import FeeTypes    "../types/fees";

module {
  /// Returns true if the caller's role may manage fees.
  public func canManageFees(role : { #SuperAdmin; #Principal; #Accountant; #Teacher; #Parent; #Student; #AdmissionCounsellor }) : Bool {
    switch role {
      case (#SuperAdmin or #Principal or #Accountant) true;
      case _ false;
    };
  };

  /// Create a new FeePayment from input.
  public func newFeePayment(
    counter  : { var nextFeeId : Nat; var nextReceiptId : Nat },
    input    : FeeTypes.FeePaymentInput,
    now      : Int,
  ) : FeeTypes.FeePayment {
    let id = "FEE-" # counter.nextFeeId.toText();
    counter.nextFeeId += 1;
    let receiptNo = "REC-" # counter.nextReceiptId.toText();
    counter.nextReceiptId += 1;
    let fine : Nat = 0;
    let netAmount : Nat = if (input.amount > input.discount) {
      input.amount - input.discount + fine
    } else {
      fine
    };
    {
      id;
      studentId         = input.studentId;
      studentName       = input.studentName;
      className         = input.className;
      amount            = input.amount;
      netAmount;
      discount          = input.discount;
      fine;
      status            = #Pending;
      paidDate          = null;
      receiptNo;
      installmentNo     = input.installmentNo;
      totalInstallments = input.totalInstallments;
      createdAt         = now;
    };
  };

  /// Apply an update to an existing FeePayment.
  public func applyFeeUpdate(
    existing : FeeTypes.FeePayment,
    input    : FeeTypes.FeePaymentInput,
  ) : FeeTypes.FeePayment {
    let fine : Nat = existing.fine;
    let netAmount : Nat = if (input.amount > input.discount) {
      input.amount - input.discount + fine
    } else {
      fine
    };
    {
      existing with
      studentId         = input.studentId;
      studentName       = input.studentName;
      className         = input.className;
      amount            = input.amount;
      netAmount;
      discount          = input.discount;
      installmentNo     = input.installmentNo;
      totalInstallments = input.totalInstallments;
    };
  };

  /// Mark a payment as paid.
  public func markPaid(
    existing : FeeTypes.FeePayment,
    paidDate : Text,
  ) : FeeTypes.FeePayment {
    { existing with status = #Paid; paidDate = ?paidDate };
  };

  /// Predicate: is a fee pending or late?
  public func isPending(fee : FeeTypes.FeePayment) : Bool {
    switch (fee.status) {
      case (#Pending or #Late) true;
      case _ false;
    };
  };
};
