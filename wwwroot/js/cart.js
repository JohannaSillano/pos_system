const cartTableBody = document.querySelector('.cart-table tbody');
let chartItemNumber = 1; // Unique ID for cart items
const cart = []; // Array to hold selected products

// Function to add items to the cart
function addToCart(id, name, amount) {
    // Add the item to the cart array
    cart.push({ id, name, quantity: 1, price: amount });
    console.log("Item added to cart:");
    console.table(cart); // Debugging: log cart array

    // Create a new row for the cart table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${chartItemNumber}</td>
        <td>${name}</td>
        <td>
            <input type="number" value="1" min="1" onchange="updateQuantity(this, ${id})">
        </td>
        <td class="item-amount">${amount.toFixed(2)}</td>
        <td>
            <button class="btn-remove remove-btn" onclick="removeCartItem(this, ${id})">Remove</button>
        </td>
    `;

    // Append the new row to the cart table body
    cartTableBody.appendChild(newRow);
    chartItemNumber++;

    // Update the total amount after adding an item
    updateTotalAmount();
}

// Function to remove a specific cart item
function removeCartItem(button, id) {
    // Find the row and remove it from the table
    const row = button.closest('tr');
    cartTableBody.removeChild(row);

    // Remove the item from the cart array
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
    }
    console.log("Item removed from cart:");
    console.table(cart); // Debugging: log cart array

    // Update the cart item number and total amount
    updateCartItemNumber();
    updateTotalAmount();
}

// Function to update the cart item number after removal
function updateCartItemNumber() {
    const rows = cartTableBody.querySelectorAll('tr');
    chartItemNumber = 1; // Reset chartItemNumber to 1 before updating number

    rows.forEach(row => {
        const idCell = row.querySelector('td:first-child');
        idCell.textContent = chartItemNumber;
        chartItemNumber++;
    });
}

// Function to calculate and update the total amount
function updateTotalAmount() {
    let subtotalAmount = 0;

    // Loop through each row in the cart
    const rows = cartTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const amountCell = row.querySelector('.item-amount');
        subtotalAmount += parseFloat(amountCell.textContent);
    });

    // Calculate tax (12%)
    const taxAmount = subtotalAmount * 0.12;

    // Calculate final total (Subtotal + Tax)
    const totalAmount = subtotalAmount + taxAmount;

    // Update the subtotal, tax, and total amount in the DOM
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.innerHTML = `
        Subtotal Amount: ₱${subtotalAmount.toFixed(2)}<br>
        Tax(12%): ₱${taxAmount.toFixed(2)}<br>
        Total Amount: ₱${totalAmount.toFixed(2)}
    `;
}

// Function to calculate change
function calculateChange() {
    // Retrieve the total amount from the DOM
    const totalAmountElement = document.getElementById("total-amount").textContent;
    const totalAmountMatch = totalAmountElement.match(/Total Amount:\s*₱(\d+(\.\d+)?)/);

    const totalAmount = totalAmountMatch ? parseFloat(totalAmountMatch[1]) : 0;

    // Retrieve the payment amount from the input
    const paymentAmount = parseFloat(document.getElementById("payment-amount").value) || 0;

    // Calculate change
    const change = paymentAmount - totalAmount;

    // Display the change
    const changeDisplay = document.getElementById("change-display");
    if (change < 0) {
        changeDisplay.textContent = "Insufficient payment";
        changeDisplay.style.color = "red";
    } else {
        changeDisplay.textContent = `₱${change.toFixed(2)}`;
        changeDisplay.style.color = "black";
    }
}
