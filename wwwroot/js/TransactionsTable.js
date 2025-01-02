document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to modal show event
    var transactionModal = document.getElementById('transactionModal');
    transactionModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget; // Button that triggered the modal
        var transactionId = button.getAttribute('data-transaction-id');
        var transactionDate = button.getAttribute('data-transaction-date');
        var subtotal = button.getAttribute('data-subtotal');
        var tax = button.getAttribute('data-tax');
        var totalAmount = button.getAttribute('data-total');
        var details = JSON.parse(button.getAttribute('data-details')); // Parse the serialized data

        // Set the modal fields
        document.getElementById('modalTransactionId').textContent = transactionId;
        document.getElementById('modalTransactionDate').textContent = transactionDate;
        document.getElementById('modalSubtotal').textContent = subtotal;
        document.getElementById('modalTax').textContent = tax;
        document.getElementById('modalTotalAmount').textContent = totalAmount;

        // Populate the product details
        var productDetailsList = document.getElementById('modalProductDetails');
        productDetailsList.innerHTML = ''; // Clear previous details
        details.forEach(function (item) {
            var listItem = document.createElement('li');
            listItem.textContent = item.ProductName + ' x ' + item.Quantity + ' - ' + item.Amount;
            productDetailsList.appendChild(listItem);
        });
    });
});
