const exportCsvButton = document.getElementById("export-csv");
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transaction-list");
const transactionCount = document.getElementById("transaction-count");
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const transactionFilter = document.getElementById("transaction-filter");
const monthFilter = document.getElementById("month-filter");
const clearMonthFilter = document.getElementById("clear-month-filter");
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

  const selectedType = transactionFilter.value;
const selectedMonth = monthFilter.value;

function matchesFilters(transaction) {
  const matchesType =
    selectedType === "all" || transaction.type === selectedType;

  const matchesMonth =
    selectedMonth === "" ||
    (transaction.date || "").startsWith(selectedMonth);

  return matchesType && matchesMonth;
}

const matchingTransactions = transactions.filter(matchesFilters);

  const count = matchingTransactions.length;
  transactionCount.textContent =
    `${count} transaction${count === 1 ? "" : "s"}`;

  if (count === 0) {
    const emptyMessage = document.createElement("li");

    emptyMessage.textContent = transactions.length === 0
      ? "No transactions yet."
      : "No transactions match this filter.";

    transactionList.appendChild(emptyMessage);
  }
  let income = 0;
  let expenses = 0;

  transactions.forEach(function (transaction, index) {
    const item = document.createElement("li");
    item.classList.add(transaction.type);
    if (!matchesFilters(transaction)) {
      item.style.display = "none";
    }

    const sign = transaction.type === "income" ? "+" : "-";

    const dateLabel = transaction.date
  ? transaction.date.split("-").reverse().join("/")
  : "No date";

    item.textContent =
      `${dateLabel} — ${transaction.description}: ${sign}${formatMoney(transaction.amount)}`;
    
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
  type: typeInput.value,
  date: dateInput.value
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

transactionFilter.addEventListener("change", function () {
  renderTransactions();
});
monthFilter.addEventListener("change", function () {
  renderTransactions();
});

clearMonthFilter.addEventListener("click", function () {
  monthFilter.value = "";
  renderTransactions();
});
function escapeCsv(value) {
  let text = String(value);

  // Keep spreadsheet apps from treating text as a formula.
  if (/^\s*[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return '"' + text.replace(/"/g, '""') + '"';
}

exportCsvButton.addEventListener("click", function () {
  if (transactions.length === 0) {
    alert("Add a transaction before exporting.");
    return;
  }

  const rows = [
    ["Date", "Description", "Type", "Amount (GBP)"]
  ];

  transactions.forEach(function (transaction) {
    rows.push([
      transaction.date || "",
      transaction.description,
      transaction.type,
      (transaction.amount / 100).toFixed(2)
    ]);
  });

  const csv = rows
    .map(function (row) {
      return row.map(escapeCsv).join(",");
    })
    .join("\r\n");

  const file = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "finance-transactions.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
});