const cartTableBody = document.querySelector('.cart-table tbody');
let cartItemId = 1; // Unique ID for cart items

// Function to add items to the cart
function addToCart(id, name, amount) {
    // Create a new row for the cart table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${cartItemId}</td>
        <td>${name}</td>
        <td>
            <input type="number" value="1" min="1" onchange="updateAmount(this, ${amount})">
        </td>
        <td class="item-amount">${amount.toFixed(2)}</td>
        <td>
            <button class="btn-remove remove-btn" onclick="removeCartItem(this)">Remove</button>
        </td>
    `;

    // Append the new row to the cart table body
    cartTableBody.appendChild(newRow);
    cartItemId++;

    // Update the total amount after adding an item
    updateTotalAmount();
}

// Function to update the total amount for a specific product
function updateAmount(input, price) {
    // Find the row and update the total amount for the product
    const row = input.closest('tr');
    const amountCell = row.querySelector('.item-amount');
    amountCell.textContent = (input.value * price).toFixed(2);

    // Update the total amount after changing quantity
    updateTotalAmount();
}

// Function to remove a specific cart item
function removeCartItem(button) {
    // Find the row and remove it from the table
    const row = button.closest('tr');
    cartTableBody.removeChild(row);

    // Update the cart item IDs and total amount
    updateCartItemIds();
    updateTotalAmount();
}

// Function to update the cart item IDs after removal
function updateCartItemIds() {
    const rows = cartTableBody.querySelectorAll('tr');
    cartItemId = 1; // Reset cartItemId to 1 before updating IDs

    rows.forEach(row => {
        const idCell = row.querySelector('td:first-child');
        idCell.textContent = cartItemId;
        cartItemId++;
    });
}

// Function to calculate and update the total amount
function updateTotalAmount() {
    let totalAmount = 0;

    // Loop through each row in the cart
    const rows = cartTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const amountCell = row.querySelector('.item-amount');
        totalAmount += parseFloat(amountCell.textContent);
    });

    // Update the total amount in the DOM
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = `Total Amount: ₱${totalAmount.toFixed(2)}`;
}
