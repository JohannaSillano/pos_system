// Function to display the modal with transaction details
function showModal(transactionId, transactionDate, subtotal, tax, totalAmount) {
    // Set the modal content
    document.getElementById('modal-transaction-id').textContent = transactionId;
    document.getElementById('modal-transaction-date').textContent = transactionDate;
    document.getElementById('modal-subtotal').textContent = subtotal;
    document.getElementById('modal-tax').textContent = tax;
    document.getElementById('modal-total').textContent = totalAmount;

    // Display the modal
    const modalElement = document.getElementById('detailsModal');
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
}