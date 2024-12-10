let customers = JSON.parse(localStorage.getItem('customers')) || [];
let selectedCustomer = null;

// Search customers for transactions
document.getElementById('customer-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const results = customers.filter((c) => c.name.toLowerCase().includes(searchTerm));
    const searchResults = document.getElementById('search-results');

    // Clear previous results
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No matching customers found.</p>';
        return;
    }

    // Display search results
    results.forEach((customer) => {
        const div = document.createElement('div');
        div.className = 'customer-item';
        div.textContent = customer.name;
        div.addEventListener('click', () => {
            selectedCustomer = customer;
            alert(`Selected Customer: ${customer.name}`);
            document.getElementById('customer-search').value = '';
            searchResults.innerHTML = '';
            renderCustomerList();
        });
        searchResults.appendChild(div);
    });
});


// Utility to generate unique IDs
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Save customers to localStorage
const saveCustomersToLocalStorage = () => {
    localStorage.setItem('customers', JSON.stringify(customers));
};

// Calculate total balance
const calculateTotalBalance = () => {
    return customers.reduce((sum, customer) => sum + customer.balance, 0);
};

// Render customer list with individual balances
const renderCustomerList = () => {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';

    if (customers.length === 0) {
        customerList.innerHTML = '<p>No customers yet. Add a customer to get started.</p>';
        return;
    }

    customers.forEach((customer) => {
        const div = document.createElement('div');
        div.className = 'customer-item';
        div.innerHTML = `
      <span>${customer.name}</span>
      <span class="customer-balance">Balance: ₹${customer.balance.toFixed(2)}</span>
    `;
        div.addEventListener('click', () => openCustomerLedger(customer.id));
        customerList.appendChild(div);
    });

    // Update the total balance display
    const totalBalanceElement = document.getElementById('total-balance');
    totalBalanceElement.textContent = `Total Balance: ₹${calculateTotalBalance().toFixed(2)}`;
};

// Open customer ledger in a new page
const openCustomerLedger = (id) => {
    const customer = customers.find((c) => c.id === id);
    localStorage.setItem('selectedCustomer', JSON.stringify(customer));
    window.location.href = 'ledger.html';
};

// Add new customer
document.getElementById('open-account-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const balance = parseFloat(document.getElementById('initial-balance').value);

    if (!name) {
        alert('Customer name is required!');
        return;
    }

    if (isNaN(balance) || balance < 0) {
        alert('Please enter a valid initial balance!');
        return;
    }

    const newCustomer = {
        id: generateId(),
        name,
        balance,
        ledger: [
            {
                type: 'Opening Balance',
                amount: balance,
                date: new Date().toLocaleDateString(),
            },
        ],
    };

    customers.push(newCustomer);
    saveCustomersToLocalStorage();
    renderCustomerList();
    alert('Account opened successfully!');
    e.target.reset();
});

// Handle transactions
document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
        alert('Please select a customer first!');
        return;
    }

    const type = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    if (type === 'withdraw' && amount > selectedCustomer.balance) {
        alert('Insufficient funds!');
        return;
    }

    selectedCustomer.balance += type === 'deposit' ? amount : -amount;
    selectedCustomer.ledger.push({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount,
        date: new Date().toLocaleDateString(),
    });

    saveCustomersToLocalStorage();
    renderCustomerList();
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
    e.target.reset();
});

// Load initial data
renderCustomerList();
