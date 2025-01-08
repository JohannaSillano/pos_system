function showModal(transactionNumber, transactionDate, subtotal, tax, totalAmount, transactionDetails) {
    // Set the modal content
    document.getElementById('modal-transaction-number').textContent = transactionNumber;
    document.getElementById('modal-transaction-date').textContent = transactionDate;
    document.getElementById('modal-subtotal').textContent = subtotal;
    document.getElementById('modal-tax').textContent = tax;
    document.getElementById('modal-total').textContent = totalAmount;

    // Clear previous items
    let itemsContainer = document.getElementById('modal-items');
    itemsContainer.innerHTML = ''; // Clear previous items

    // Add the new transaction items to the modal
    transactionDetails.forEach(item => {
        let itemElement = document.createElement('div');
        itemElement.style.display = 'flex'; // Align item and amount side by side

        // Product name and quantity on the left
        let productDetails = document.createElement('span');
        productDetails.style.flex = '1'; // Take the remaining space for name and quantity
        productDetails.textContent = `${item.ProductName} x ${item.Quantity}`;

        // Amount on the right
        let amountDetails = document.createElement('span');
        amountDetails.style.textAlign = 'right'; // Align amount to the right
        amountDetails.textContent = `₱${item.Amount.toFixed(2)}`;

        // Append the elements
        itemElement.appendChild(productDetails);
        itemElement.appendChild(amountDetails);

        // Add the item to the modal container
        itemsContainer.appendChild(itemElement);
    });

    // Display the modal
    const modalElement = document.getElementById('detailsModal');
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
}
