const cartTableBody = document.querySelector('.cart-table tbody');
let cartItemId = 1; // Unique ID for cart items
let cart = []; // Array to store cart items

// Add product to cart
function addToCart(Id, name, amount, stockQuantity) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-cart-item-id', cartItemId);
    newRow.innerHTML = `
        <td>${cartItemId}</td>
        <td>${name}</td>
        <td>
            <input type="number" value="1" min="1" max="${stockQuantity}" 
                onchange="handleQuantityChange(this, ${cartItemId}, ${amount}, ${stockQuantity})">
        </td>
        <td class="item-amount">${amount.toFixed(2)}</td>
        <td>
            <button class="btn-remove remove-btn" onclick="removeCartItem(${cartItemId})">Remove</button>
        </td>
    `;

    cartTableBody.appendChild(newRow);

    const cartItem = {
        cartItemId: cartItemId,
        id: Id,
        productName: name,
        productSubtotal: amount,
        quantity: 1
    };
    cart.push(cartItem);

    cartItemId++;
    updateTotalAmount();

    // Debug log to see cart array after adding an item
    console.log("Cart after adding item:", cart);
    console.table(cart);
}

// Handle quantity change
function handleQuantityChange(inputElement, cartItemId, amount, stockQuantity) {
    const newQuantity = parseInt(inputElement.value);

    if (newQuantity > stockQuantity) {
        inputElement.value = stockQuantity;
        alert(`Cannot add more than ${stockQuantity} items to the cart.`);
    }
    // Update the item amount in the table
    const itemAmountCell = inputElement.closest('tr').querySelector('.item-amount');
    itemAmountCell.textContent = (newQuantity * amount).toFixed(2);
    // Update the cart item quantity and product subtotal
    const cartItem = cart.find(item => item.cartItemId === cartItemId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        cartItem.productSubtotal = newQuantity * amount;
    }
    // Update the total amount
    updateTotalAmount();
    // Debug log to see cart array after adding an item
    console.log("Cart after quantity change:", cart);
    console.table(cart);
}

// Remove cart item
function removeCartItem(cartItemId) {
    const row = cartTableBody.querySelector(`tr[data-cart-item-id="${cartItemId}"]`);
    if (row) {
        cartTableBody.removeChild(row);
    }

    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartItemIds()
    updateTotalAmount();
    // Debug log to see cart array after adding an item
    console.log("Cart after removing item:", cart);
    console.table(cart);
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

// Update total amount
function updateTotalAmount() {
    let subtotalAmount = 0;

    cart.forEach(item => {
        subtotalAmount += item.productSubtotal;
    });

    const taxAmount = subtotalAmount * 0.12;
    const totalAmount = subtotalAmount + taxAmount;

    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.innerHTML = `
        Subtotal Amount: ₱${subtotalAmount.toFixed(2)}<br>
        Tax (12%): ₱${taxAmount.toFixed(2)}<br>
        Total Amount: ₱${totalAmount.toFixed(2)}
    `;

    // Debug log to see cart array after adding an item
    console.log("Cart after updating total amount:", cart);
    console.table(cart);
}

// Calculate change
function calculateChange() {
    const totalAmountElement = document.getElementById("total-amount").textContent;
    const totalAmountMatch = totalAmountElement.match(/Total Amount:\s*₱(\d+(\.\d+)?)/);

    const totalAmount = totalAmountMatch ? parseFloat(totalAmountMatch[1]) : 0;
    const paymentAmount = parseFloat(document.getElementById("payment-amount").value) || 0;

    const change = paymentAmount - totalAmount;

    const changeDisplay = document.getElementById("change-display");
    if (change < 0) {
        changeDisplay.textContent = "Insufficient payment";
        changeDisplay.style.color = "red";
    } else {
        changeDisplay.textContent = `₱${change.toFixed(2)}`;
        changeDisplay.style.color = "white";
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    else{
        // Debug log to see cart array after adding an item
        console.log("Cart before checkout:", cart);
        console.table(cart);
        
        const modal = new bootstrap.Modal(document.getElementById('confirmation-popup'), {
            backdrop: 'static',
            keyboard: false
        });
        modal.show();
    }
}

// Yes receipt handler
function yesReceipt() {
    alert("Transaction successful! Receipt will be printed.");
    resetCart(); // Call resetCart when the transaction is successful
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
    modal.hide();

}

// No receipt handler
function noReceipt() {
    resetCart(); // Call resetCart when the transaction is successful
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
    modal.hide();
}

// Reset cart
function resetCart() {
    cart = []; // Clear the cart array
    cartTableBody.innerHTML = ''; // Clear the table
    cartItemId = 1; // Reset cart item ID
    updateTotalAmount(); // Reset total amount
}