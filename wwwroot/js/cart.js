const cartTableBody = document.querySelector('.cart-table tbody');
let cartItemId = 1; // Unique ID for cart items
let cart = []; // Array to store cart items

function addToCart(cartItemId, name, amount, stockQuantity) {
    // Create a new row for the cart table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${cartItemId}</td>
        <td>${name}</td>
        <td>
            <input type="number" value="1" min="1" max="${stockQuantity}" 
                onchange="handleQuantityChange(this, ${amount}, ${stockQuantity})">
        </td>
        <td class="item-amount">${amount.toFixed(2)}</td>
        <td>
            <button class="btn-remove remove-btn" onclick="removeCartItem(this)">Remove</button>
        </td>
    `;

    // Append the new row to the cart table body
    cartTableBody.appendChild(newRow);
    cartItemId++;
    // Create a new cart item object and add it to the cart array
    const cartItem = {
        id: cartItemId - 1,
        productName: name,
        productSubtotal: amount,
        quantity: 1
    };
    cart.push(cartItem);
    // Update the total amount after adding an item
    updateTotalAmount();
}

// Function to handle quantity change and prevent exceeding stock
function handleQuantityChange(inputElement, amount, stockQuantity) {
    const newQuantity = parseInt(inputElement.value);

    if (newQuantity > stockQuantity) {
        // Reset the value to the maximum stock available
        inputElement.value = stockQuantity;

        // Display a warning to the user
        alert(`Cannot add more than ${stockQuantity} items to the cart. Stock limit reached.`);
    }

    // Update the item amount in the table based on the new quantity
    const itemAmountCell = inputElement.closest('tr').querySelector('.item-amount');
    itemAmountCell.textContent = (newQuantity * amount).toFixed(2);

    // Find the cart item object in the cart array and update its quantity
    const cartItemId = inputElement.closest('tr').querySelector('td:first-child').textContent;
    const cartItem = cart.find(item => item.id == cartItemId);

    if (cartItem) {
        cartItem.quantity = newQuantity; // Update the quantity in the cart array\
        cartItem.productSubtotal = newQuantity * amount; // Update the subtotal in the cart array
    }

    // Recalculate the total cart amount after updating quantity
    updateTotalAmount();
}

// Function to remove a specific cart item
function removeCartItem(button) {
    // Find the row and remove it from the table
    const row = button.closest('tr');
    const cartItemId = row.querySelector('td:first-child').textContent; // Get the cart item ID

    // Remove the item from the cart array based on its ID
    cart = cart.filter(item => item.id != cartItemId);

    // Remove the row from the table
    cartTableBody.removeChild(row);

    // Update the cart item IDs and total amount
    updateCartItemIds();
    updateTotalAmount();
}

// Function to update cart item IDs after an item is removed (optional)
function updateCartItemIds() {
    // Reassign cart item IDs after removal
    const rows = cartTableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1; // Reassign new IDs
        const cartItemId = row.querySelector('td:first-child').textContent;
        const cartItem = cart.find(item => item.id == cartItemId);
        if (cartItem) {
            cartItem.id = index + 1; // Update the cart array ID
        }
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
        changeDisplay.style.color = "green";
    }
}

// Function to show the modal
function checkout() {
    // Initialize and show the modal with static backdrop and no keyboard closing
    const modal = new bootstrap.Modal(document.getElementById('confirmation-popup'), {
        backdrop: 'static',  // Prevent closing by clicking the backdrop
        keyboard: false      // Prevent closing with ESC key
    });
    modal.show();
}

// Function to handle 'Yes' click (Print Receipt)
function yesReceipt() {
    alert("Receipt will be printed.");
    
    // Optionally, close the modal after confirming
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
    modal.hide();
}

// Function to handle 'No' click (Do not print receipt)
function noReceipt() {    
    // Optionally, close the modal after canceling
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
    modal.hide();
}

