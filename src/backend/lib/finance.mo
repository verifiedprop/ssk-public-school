import List           "mo:core/List";
import Nat            "mo:core/Nat";
import FinanceTypes   "../types/finance";
import Text "mo:core/Text";

module {
  /// Create a new Transaction.
  public func newTransaction(
    counter : { var nextTransactionId : Nat },
    input   : FinanceTypes.TransactionInput,
    now     : Int,
  ) : FinanceTypes.Transaction {
    let id = "TXN-" # counter.nextTransactionId.toText();
    counter.nextTransactionId += 1;
    {
      id;
      txType          = input.txType;
      amount          = input.amount;
      description     = input.description;
      expenseCategory = input.expenseCategory;
      incomeCategory  = input.incomeCategory;
      date            = input.date;
      reference       = input.reference;
      createdAt       = now;
    };
  };

  /// Build a MonthlyReport for a given month + year.
  public func monthlyReport(
    transactions : List.List<FinanceTypes.Transaction>,
    month        : Text,
    year         : Nat,
  ) : FinanceTypes.MonthlyReport {
    var totalIncome   : Nat = 0;
    var totalExpenses : Nat = 0;
    transactions.forEach(func(t) {
      if (t.date.size() >= 7) {
        // date format: YYYY-MM-DD or YYYY-MM
        // extract YYYY = chars 0-3, MM = chars 5-6
        let chars    = t.date.toArray();
        let yearStr  = chars.sliceToArray(0, 4);
        let monthStr = chars.sliceToArray(5, 7);
        let tYear  = Nat.fromText(Text.fromArray(yearStr));
        let tMonth = Text.fromArray(monthStr);
        let yearMatches = switch tYear { case (?y) y == year; case null false };
        if (yearMatches and tMonth == month) {
          switch (t.txType) {
            case (#Income)  { totalIncome   += t.amount };
            case (#Expense) { totalExpenses += t.amount };
          };
        };
      };
    });
    {
      month;
      year;
      totalIncome;
      totalExpenses;
      profit = totalIncome.toInt() - totalExpenses.toInt();
    };
  };

  /// Helper: convert array of Char to Text.
  private func _textFromCharArray(chars : [Char]) : Text {
    Text.fromArray(chars);
  };

  private func _charToText(c : Char) : Text {
    Text.fromChar(c);
  };

  /// Month codes in order for annual report.
  public let monthCodes : [Text] = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12",
  ];
};
