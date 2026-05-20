import CommonTypes "common";

module {
  public type FeeStatus = {
    #Pending;
    #Paid;
    #Late;
    #PartiallyPaid;
  };

  public type FeeStructure = {
    id            : Text;
    className     : Text;
    amount        : Nat;
    month         : Text;
    year          : Nat;
    dueDate       : Text;
    finePercentage: Float;
  };

  public type FeePayment = {
    id               : Text;
    studentId        : Text;
    studentName      : Text;
    className        : Text;
    amount           : Nat;
    netAmount        : Nat;
    discount         : Nat;
    fine             : Nat;
    status           : FeeStatus;
    paidDate         : ?Text;
    receiptNo        : Text;
    installmentNo    : ?Nat;
    totalInstallments: ?Nat;
    createdAt        : CommonTypes.Timestamp;
  };

  public type FeePaymentInput = {
    studentId        : Text;
    studentName      : Text;
    className        : Text;
    amount           : Nat;
    discount         : Nat;
    installmentNo    : ?Nat;
    totalInstallments: ?Nat;
  };
};
