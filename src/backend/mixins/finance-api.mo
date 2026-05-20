import List           "mo:core/List";
import Array          "mo:core/Array";
import Time           "mo:core/Time";
import Runtime        "mo:core/Runtime";
import FinanceTypes   "../types/finance";
import SchoolTypes    "../types/school";
import FinanceLib     "../lib/finance";

mixin (
  transactions     : List.List<FinanceTypes.Transaction>,
  financeCounters  : { var nextTransactionId : Nat },
  userRole         : (Principal) -> ?SchoolTypes.Role,
) {
  public shared ({ caller }) func createTransaction(input : FinanceTypes.TransactionInput) : async FinanceTypes.Transaction {
    let role = switch (userRole(caller)) {
      case (?r) r;
      case null Runtime.trap("Unauthorized");
    };
    switch role {
      case (#SuperAdmin or #Principal or #Accountant) {};
      case _ Runtime.trap("Unauthorized");
    };
    let now = Time.now();
    let txn = FinanceLib.newTransaction(financeCounters, input, now);
    transactions.add(txn);
    txn;
  };

  public shared query func getTransaction(id : Text) : async ?FinanceTypes.Transaction {
    transactions.find(func(t) { t.id == id });
  };

  public shared query func listTransactions(txType : ?FinanceTypes.TransactionType) : async [FinanceTypes.Transaction] {
    switch txType {
      case (?tt) transactions.filter(func(t) {
        switch (t.txType, tt) {
          case (#Income, #Income)   true;
          case (#Expense, #Expense) true;
          case _ false;
        };
      }).toArray();
      case null transactions.toArray();
    };
  };

  public shared query func getMonthlyReport(month : Text, year : Nat) : async FinanceTypes.MonthlyReport {
    FinanceLib.monthlyReport(transactions, month, year);
  };

  public shared query func getAnnualReport(year : Nat) : async [FinanceTypes.MonthlyReport] {
    FinanceLib.monthCodes.map<Text, FinanceTypes.MonthlyReport>(
      func(m) { FinanceLib.monthlyReport(transactions, m, year) },
    );
  };
};
