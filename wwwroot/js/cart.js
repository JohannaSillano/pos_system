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
    // Construct the transaction object
    const transaction = {
        TransactionNumber: generateTransactionNumber(),
        TransactionDate: new Date().toISOString(),
        SubTotal: subtotalAmount.toFixed(2),
        Tax: taxAmount.toFixed(2),
        TotalAmount: totalAmount.toFixed(2),
        EmployeeId: employeeId
    };

    console.log('Cart in the create transaction after transaction object:', cart);
    console.log("Transaction data:",transaction)

    try {
        // Need to copy the content of the cart because the cart will become empty after the fetch statement
        const copyCart = cart; // Make a copy of the content in the cart to pass it in the createTransactionDetails when it call.

        // Send the transaction object to the server using fetch API to create transaction in POS database
        const response = await fetch ('/Transactions/PostTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
            const message = data.message;
            const lastTransactionId = data.transactionId;

            console.log('Last Transaction Id:', lastTransactionId);
            console.log('Cart content in the create transaction:', cart);
            alert(message);

            // Call the createTransactionDetails and pass the copyCart and lastTransactionId
            createTransactionDetails(copyCart, lastTransactionId);
        } else {
            const error = await response.json();
            alert('Transaction failed: ' + error.message);
        }
    } catch (err) {
        console.error('Error posting transaction:', err);
        alert('An error occurred while processing the transaction.');
    }
}

// Yes receipt handler
async function yesReceipt() {
    console.log('Cart in the yes receipt:', cart);
    await createTransaction();
    printReceipt(); // Call printReceipt when the transaction is successful
    if(printReceipt){
        resetCart(); // Call resetCart when the transaction is successful
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmation-popup'));
        modal.hide();
    }
    else{
        alert("Error printing receipt");
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

// Print receipt function
function printReceipt(transactionId) {
    console.log("loadDetails function called with transactionId:", transactionId);
    try {
        // Fetch transaction details using fetchTransactionDetails and handle the returned Promise
        fetchTransactionDetails(transactionId)
            .then(data => {
                if (!data.success) {
                    alert(data.message || "Failed to load transaction details.");
                    return;
                }

                // Load data into the modal
                generatePDFInvoice(data);
            })
            .catch(error => {
                console.error("Error fetching transaction details:", error);
                alert("Error loading transaction details.");
            });
    } catch (error) {
        console.error("Unexpected error in printReceipt:", error);
        alert("Error loading transaction details.");
    }
}

// Function to generate PDF invoice
function generatePDFInvoice(data) {
    const { jsPDF } = window.jspdf; // Destructure jsPDF from the global object
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(16);
    doc.text("Invoice", 14, 20);

    // Add Transaction Number
    doc.setFontSize(12);
    doc.text(`Transaction Number: TRN-${data.transactionNumber}`, 14, 30);

    // Add Cashier Name
    doc.text(`Cashier: ${data.cashier}`, 14, 40);

    // Add Transaction Date
    doc.text(`Transaction Date: ${new Date(data.transactionDate).toLocaleDateString()}`, 14, 50);

    // Add a line separator
    doc.line(14, 55, 195, 55);

    // Add Products Section
    doc.text("Products:", 14, 65);
    let yOffset = 75; // Start drawing products from this point
    data.products.forEach(product => {
        doc.text(`${product.productName} x ${product.quantity}`, 14, yOffset);
        doc.text(`₱${product.amount.toFixed(2)}`, 150, yOffset);
        yOffset += 10; // Add space between each product
    });

    // Add a line separator
    doc.line(14, yOffset + 5, 195, yOffset + 5);

    // Add Subtotal, Tax, Total Amount
    doc.text(`Subtotal: ₱${data.subtotal.toFixed(2)}`, 14, yOffset + 15);
    doc.text(`Tax: ₱${data.tax.toFixed(2)}`, 14, yOffset + 25);
    doc.text(`Total Amount: ₱${data.totalAmount.toFixed(2)}`, 14, yOffset + 35);

    // Save the generated PDF
    doc.save(`Invoice_TRN-${data.transactionNumber}.pdf`);
}

function resetSelectBtnState() {
    const allSelectBtn = document.querySelectorAll('.btn-select'); // Get all the elements that has a 'btn-select' class

    // Remove all the class of disabled-select-btn and the disabled button state
    allSelectBtn.forEach(button => {
        button.innerHTML = `Select`; // Reset the button label
        button.classList.remove('disabled-select-btn'); // Remove the class of disabled-select-btn
        button.disabled = false; // Remove the disabled state of the button
    });
}

// Reset cart
function resetCart() {
    cart = []; // Clear the cart array
    cartTableBody.innerHTML = ''; // Clear the table
    cartItemId = 1; // Reset cart item ID
    resetSelectBtnState(); // Reset the select btn state
    updateTotalAmount(); // Reset total amount
}
