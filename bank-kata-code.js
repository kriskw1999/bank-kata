const TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
};

class Transaction {
  constructor(date, amount, type) {
    this.date = date;
    this.amount = amount;
    this.type = type;
  }

  get isoDate() {
    return this.date.toLocaleDateString();
  }

  toString() {
    if (this.type === TRANSACTION_TYPE.DEPOSIT) {
      return `${this.isoDate} || ${this.amount} ||`;
    }

    return `${this.isoDate} || || ${this.amount}`;
  }
}

class Account {
  constructor() {
    this.balance = 0;
    this.transactions = [];
  }

  deposit(amount, date = new Date()) {
    const transaction = new Transaction(date, amount, TRANSACTION_TYPE.DEPOSIT);
    this.transactions.push(transaction);
    this.balance += amount;
  }

  withdraw(amount, date = new Date()) {
    if (amount > this.balance) return "Insufficient funds";

    const transaction = new Transaction(
      date,
      -amount,
      TRANSACTION_TYPE.WITHDRAWAL
    );
    this.transactions.push(transaction);
    this.balance -= amount;
  }

  transfer(amount, toAccount, date = new Date()) {
    const withdrawal = this.withdraw(amount, date);
    if (withdrawal === "Insufficient funds") return withdrawal;

    toAccount.deposit(amount, date);
  }

  filterTransactions(filter) {
    return this.transactions.filter(filter);
  }

  getStatement(filter = () => true) {
    const transactionsStatement = this.filterTransactions(filter).map(
      (transaction) => `${transaction.toString()} || ${this.balance}`
    );

    const header = "date || credit || debit || balance";

    return [header, ...transactionsStatement, "\n"].join("\n");
  }

  get depositStatement() {
    return this.getStatement((t) => t.type === TRANSACTION_TYPE.DEPOSIT);
  }

  get withdrawalStatement() {
    return this.getStatement((t) => t.type === TRANSACTION_TYPE.WITHDRAWAL);
  }
}

const accountA = new Account();
const accountB = new Account();

accountA.deposit(1000);
accountA.withdraw(500);

accountA.transfer(200, accountB);

console.log(accountA.getStatement());
console.log(accountB.getStatement());

console.log(accountA.depositStatement);
console.log(accountA.withdrawalStatement);
