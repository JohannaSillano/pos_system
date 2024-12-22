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
    let totalAmount = 0;

    // Loop through each item in the cart array
    cart.forEach(item => {
        totalAmount += item.quantity * item.price; // Use quantity in calculation
    });

    // Update the total amount in the DOM
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.textContent = `Total Amount: ₱${totalAmount.toFixed(2)}`;
    console.log("Total amount updated:", totalAmount);
}

// Function to update the quantity of the product
function updateQuantity(input, id) {
    // Find the row and the updated quantity
    const row = input.closest('tr');
    const updatedQuantity = parseInt(input.value);

    // Find the item in the cart array and update its quantity
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity = updatedQuantity;
    }

    // Update the amount in the DOM
    const amountCell = row.querySelector('.item-amount');
    amountCell.textContent = (cartItem.quantity * cartItem.price).toFixed(2);

    console.log("Cart item updated:");
    console.table(cart); // Debugging: log cart array

    // Update the total amount
    updateTotalAmount();
}

// Function to debug the entire cart
function debugCart() {
    console.log("Current cart contents:");
    console.table(cart); // Tabular display of the cart
}