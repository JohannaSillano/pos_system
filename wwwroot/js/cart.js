const employeeId = document.getElementById('employeeId').value; // get the value of the element that has an id of employeeId.
const cartTableBody = document.querySelector('.cart-table tbody');
let cartItemId = 1; // Unique ID for cart items
let cart = []; // Object to store cart items
let subtotalAmount = 0;
let taxAmount = 0;
let totalAmount = 0;

// Check if the product is already in the cart
function checkCartItem(Id) {
    const selectBtn = document.getElementById(Id); // Get the button element with the given Id
    const productInCart = cart.some(item => item.id === Id); // Check if the product exists in the cart

    if (productInCart) {
        selectBtn.innerHTML = `Selected`; // Update the button label
        selectBtn.disabled = true; // Disable the button
        selectBtn.classList.add('disabled-select-btn'); // Add custom disabled class
    } else {
        selectBtn.innerHTML = `Select`; // Reset the button label
        selectBtn.disabled = false; // Enable the button
        selectBtn.classList.remove('disabled-select-btn'); // Remove custom disabled class
    }
}

// Add product to cart
function addToCart(Id, name, amount, stockQuantity) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-cart-item-id', cartItemId);
    newRow.setAttribute('data-product-id', Id)
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
    checkCartItem(Id); // Update the button state
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
    const idValue = row.getAttribute('data-product-id') // Get the value of the 'data-product-id' attribute
    console.log('IdValue:', idValue)
    if (row) {
        cartTableBody.removeChild(row);
    }

    cart = cart.filter(item => item.cartItemId !== cartItemId);
    checkCartItem(idValue); // Update the button state
    updateCartItemIds();
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
    subtotalAmount = 0;

    cart.forEach(item => {
        subtotalAmount += item.productSubtotal;
    });

    taxAmount = subtotalAmount * 0.12;
    totalAmount = subtotalAmount + taxAmount;

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

// Transaction number generator
function generateTransactionNumber() {
    const prefix = 'TRN'; // You can change the prefix as needed
    const randomNumber = Math.floor(Math.random() * 1000000); // Generates a random number
    const transactionNumber = `${prefix}-${randomNumber}-${Date.now()}`; // Combines the prefix, random number, and timestamp
    return transactionNumber;
}

// Checkout function
async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    else{
        // Debug log to see cart array after adding an item
        console.log("Cart before checkout:", cart);
        console.table(cart);
        console.log("Subtotal before checkout", subtotalAmount.toFixed(2));
        console.log("Tax before checkout", taxAmount.toFixed(2));
        console.log("Total Amount before checkout", totalAmount.toFixed(2));
        console.log("EmployeeId", employeeId);

        const modal = new bootstrap.Modal(document.getElementById('confirmation-popup'), {
            backdrop: 'static',
            keyboard: false
        });
        modal.show();
    }
}

async function createTransactionDetails(cart, transactionId) {
    console.log('Cart content:', cart);
    // Construct the transaction details array
    const transactionDetails = cart.map(item => ({
        TransactionId: transactionId,
        ProductId: item.id, // Extract the specific ProductId field
        Quantity: item.quantity, // Extract the specific quantity field
        Amount: item.productSubtotal // Extract the specific productSubtotal field
    }));

    console.log('transaction details:', transactionDetails);
    console.table('transaction details:', transactionDetails);

    try {
        // Send the transaction details object to the server using fetch API to create transaction details in the POS Database
        const response = await fetch ('/Transactions/PostTransactionDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionDetails)
        });

        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
            const message = data.message;

            alert(message);
        } else {
            const error = await response.json();
            alert('Transaction Details failed: ' + error.message);
        }
    } catch (err) {
        console.error('Error posting transaction:', err);
        alert('An error occurred while processing the transaction details.');
    }
}

async function createTransaction() {
    const transaction = {
        TransactionNumber: generateTransactionNumber(),
        TransactionDate: new Date().toISOString(),
        SubTotal: subtotalAmount.toFixed(2),
        Tax: taxAmount.toFixed(2),
        TotalAmount: totalAmount.toFixed(2),
        EmployeeId: employeeId
    };

    try {
        const response = await fetch('/Transactions/PostTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (response.ok) {
            const data = await response.json();
            const lastTransactionId = data.transactionId; // Get the transaction ID
            console.log('Transaction created successfully. ID:', lastTransactionId);
            alert(data.message);

            const copyCart = [...cart]; // Copy the cart to prevent mutation
            await createTransactionDetails(copyCart, lastTransactionId);

            return lastTransactionId; // Return the transaction ID
        } else {
            const error = await response.json();
            alert('Transaction failed: ' + error.message);
            return null;
        }
    } catch (err) {
        console.error('Error creating transaction:', err);
        alert('An error occurred while processing the transaction.');
        return null;
    }
}

// Yes receipt handler
async function yesReceipt() {
    console.log('Cart in yesReceipt:', cart);

    const transactionId = await createTransaction(); // Wait for the transaction ID
    if (transactionId) {
        // Open the invoice in a new tab
        openInvoice(transactionId);
        resetCart(); // Reset the cart after transaction success

        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
        modal.hide();

        // Open the invoice in a new tab
        openInvoice(transactionId);
    } else {
        alert("Error creating transaction. Receipt cannot be printed.");
    }
}


// No receipt handler
async function noReceipt() {
    console.log('Cart in the no receipt:', cart);
    await createTransaction();
    resetCart(); // Call resetCart when the transaction is successful
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
    modal.hide();
}


function openInvoice(transactionId) {
    const url = `/Invoice/Invoice?transactionId=${transactionId}`;
    window.open(url, '_blank');
}

function resetSelectBtnState() {
    const selectButtons = document.querySelectorAll('.btn-select'); // Assuming buttons have this class
    selectButtons.forEach(button => {
        button.innerHTML = 'Select';
        button.disabled = false;
        button.classList.remove('disabled-select-btn');
    });
}

function resetCart() {
    cart = []; // Clear the cart array
    cartTableBody.innerHTML = ''; // Clear the table
    cartItemId = 1; // Reset cart item ID
    resetSelectBtnState(); // Reset the select button state
    updateTotalAmount(); // Reset total amount
}

