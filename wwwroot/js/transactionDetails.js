function fetchTransactionDetails(transactionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Transactions/GetTransactionDetails',
            type: 'GET',
            data: { transactionId: transactionId },
            dataType: 'json',
            success: function (data) {
                resolve(data); // Resolve the promise with the data
            },
            error: function (error) {
                reject(error); // Reject the promise if an error occurs
            }
        });
    });
}


function loadTransactionDetailsIntoModal(data) {
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
    data.products.forEach(product => {
        const productHtml = `
            <div class="d-flex justify-content-between">
                <span>${product.productName} x ${product.quantity}</span>
                <span>₱${product.amount.toFixed(2)}</span>
            </div>
        `;
        itemsContainer.append(productHtml);
    });

    // Show the modal
    myModal.show();
}

async function loadDetails(transactionId) {
    console.log("loadDetails function called with transactionId:", transactionId);

    try {
        // Fetch transaction details
        const data = await fetchTransactionDetails(transactionId);

        if (!data.success) {
            alert(data.message || "Failed to load transaction details.");
            return;
        }

        // Load data into the modal
        loadTransactionDetailsIntoModal(data);
    } catch (error) {
        console.log("AJAX error: Failed to load transaction details.");
        alert("Error loading transaction details.");
    }
}
