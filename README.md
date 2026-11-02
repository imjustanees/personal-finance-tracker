# Personal Finance Tracker

A responsive web app for tracking income, expenses, and your balance.

## Features

- Add income and expense transactions.
- Calculate total income, expenses, and remaining balance.
- Delete transactions and update totals.
- Keep transactions after refreshing using localStorage.
- Responsive layout for desktop and mobile screens.

## Built with

- HTML
- CSS
- JavaScript

## How to run

1. Download or clone this repository.
2. In the project folder, run:
   python3 -m http.server 8000
3. Open http://localhost:8000 in your browser.

## How it works

Transactions are stored in a JavaScript array. Adding or deleting
a transaction updates the list, recalculates the totals, and saves
the data to localStorage.

Money is stored as whole numbers of pence and formatted as GBP
for display.

## Limitations

Transaction data is saved only in the current browser for this
site. It does not sync between devices and can be removed by
clearing browser data.

## Future improvements

- Transaction dates and categories.
- Filter transactions by type or month.
- Export transactions as CSV.