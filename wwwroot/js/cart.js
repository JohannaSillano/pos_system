const cartTableBody = document.querySelector('.cart-table tbody');
let cartItemId = 1; // Unique ID for cart items

function addToCart(id, name, amount) {
    // Create a new row for the cart table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${cartItemId}</td>
        <td>${name}</td>
        <td>
            <input type="number" value="1" min="1" onchange="updateAmount(this, ${amount})">
        </td>
        <td class="item-amount">${amount.toFixed(2)}</td>
    `;

    // Append the new row to the cart table body
    cartTableBody.appendChild(newRow);
    cartItemId++;
}

function updateAmount(input, price) {
    // Find the row and update the total amount for the product
    const row = input.closest('tr');
    const amountCell = row.querySelector('.item-amount');
    amountCell.textContent = (input.value * price).toFixed(2);
}
