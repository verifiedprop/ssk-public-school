import CommonTypes "common";

module {
  public type TransactionType = {
    #Income;
    #Expense;
  };

  public type ExpenseCategory = {
    #Salary;
    #Transport;
    #Utilities;
    #Maintenance;
    #Miscellaneous;
  };

  public type IncomeCategory = {
    #TuitionFee;
    #TransportFee;
    #AdmissionFee;
    #OtherFee;
  };

  public type Transaction = {
    id              : Text;
    txType          : TransactionType;
    amount          : Nat;
    description     : Text;
    expenseCategory : ?ExpenseCategory;
    incomeCategory  : ?IncomeCategory;
    date            : Text;
    reference       : ?Text;
    createdAt       : CommonTypes.Timestamp;
  };

  public type TransactionInput = {
    txType          : TransactionType;
    amount          : Nat;
    description     : Text;
    expenseCategory : ?ExpenseCategory;
    incomeCategory  : ?IncomeCategory;
    date            : Text;
    reference       : ?Text;
  };

  public type MonthlyReport = {
    month         : Text;
    year          : Nat;
    totalIncome   : Nat;
    totalExpenses : Nat;
    profit        : Int;
  };
};
