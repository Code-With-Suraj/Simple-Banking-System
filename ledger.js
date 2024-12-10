const customer = JSON.parse(localStorage.getItem('selectedCustomer'));

document.getElementById('customer-name').textContent = `${customer.name}'s Ledger`;

const ledgerRows = document.getElementById('ledger-rows');
let runningBalance = 0;

customer.ledger.forEach((entry) => {
  runningBalance += entry.type === 'Withdraw' ? -entry.amount : entry.amount;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.date}</td>
    <td>${entry.type}</td>
    <td>₹${entry.amount.toFixed(2)}</td>
    <td>₹${runningBalance.toFixed(2)}</td>
  `;
  ledgerRows.appendChild(row);
});
