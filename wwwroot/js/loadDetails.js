function loadDetails(transactionId) {
    console.log("loadDetails function called with transactionId:", transactionId);

    $.ajax({
        url: '/Transactions/GetTransactionDetails',
        type: 'GET',
        data: { transactionId: transactionId },
        dataType: 'json',
        success: function (data) {
            console.log("AJAX success:", data);

            if (!data.success) {
                alert(data.message || "Failed to load transaction details.");
                return;
            }

            // Initialize the modal
            var myModal = new bootstrap.Modal(document.getElementById('detailsModal'));

            // Populate modal fields
            $('#modal-transaction-number').text(`TRN-${data.transactionNumber}`);
            $('#modal-transaction-cashier').text(data.cashier);
            $('#modal-transaction-date').text(new Date(data.transactionDate).toLocaleDateString());
            $('#modal-subtotal').text(data.subtotal.toFixed(2));
            $('#modal-tax').text(data.tax.toFixed(2));
            $('#modal-total').text(data.totalAmount.toFixed(2));
            
            // Populate product list in the modal
            const itemsContainer = $('#modal-items');
            itemsContainer.empty(); // Clear previous items
            data.products.forEach(product => { // Updated case
                const productHtml = `
                    <div class="d-flex justify-content-between">
                        <span>${product.productName} x ${product.quantity}</span> <!-- Updated case -->
                        <span>₱${product.amount.toFixed(2)}</span> <!-- Updated case -->
                    </div>
                `;
                itemsContainer.append(productHtml);
                console.log("Product added:", product.productName, "x", product.quantity, "Amount:", product.amount);
            });

            // Show the modal
            console.log("Showing modal...");
            myModal.show();
        },
        error: function () {
            console.log("AJAX error: Failed to load transaction details.");
            alert("Error loading transaction details.");
        }
    });
}
