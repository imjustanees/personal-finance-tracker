const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");

const transactions = JSON.parse(
  localStorage.getItem("finance-transactions") || "[]"
);

function formatMoney(pence) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP"
  });
}

function renderTransactions() {
  transactionList.replaceChildren();

  let income = 0;
  let expenses = 0;

  transactions.forEach(function (transaction, index) {
    const item = document.createElement("li");
    const sign = transaction.type === "income" ? "+" : "-";

    item.textContent =
      `${transaction.description}: ${sign}${formatMoney(transaction.amount)}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
      transactions.splice(index, 1);

      localStorage.setItem(
        "finance-transactions",
        JSON.stringify(transactions)
      );

      renderTransactions();
    });

    item.append(" ", deleteButton);
    transactionList.appendChild(item);

    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  });

  incomeDisplay.textContent = formatMoney(income);
  expensesDisplay.textContent = formatMoney(expenses);
  balanceDisplay.textContent = formatMoney(income - expenses);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Math.round(Number(amountInput.value) * 100);

  if (!description || !Number.isSafeInteger(amount) || amount <= 0) {
    return;
  }

  transactions.push({
    description: description,
    amount: amount,
    type: typeInput.value
  });

    localStorage.setItem(
    "finance-transactions",
    JSON.stringify(transactions)
  );

  renderTransactions();
  form.reset();
  descriptionInput.focus();
});
renderTransactions();