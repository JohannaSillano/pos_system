async function searchProduct() {
    let query = document.getElementById("search-bar").value;

    // Build the URL for fetching products
    let url = query && query.trim() !== ""
        ? `/Home/SearchProduct?productQuery=${encodeURIComponent(query)}`
        : `/Home/SearchProduct?productQuery=`;

    try {
        let response = await fetch(url); // Fetch data from the controller

        // If the response is not OK, handle the error
        if (!response.ok) {
            throw new Error("Unable to fetch products. Please try again later.");
        }

        let products = await response.json(); // Parse the JSON response

        // Update the product list table
        let productListBody = document.getElementById("product-list-body");
        productListBody.innerHTML = ''; // Clear existing rows

        if (products && products.length > 0) {
            products.forEach(product => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>₱${product.price.toFixed(2)}</td>
                    <td>
                        <button class="btn-select"
                                onclick="addToCart(${product.id}, '${product.name}', ${product.price}, ${product.stockQuantity})">
                            Select
                        </button>
                    </td>
                `;
                productListBody.appendChild(row);
            });
        } else {
            // No products found case
            let row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">No products found.</td>`;
            productListBody.appendChild(row);
        }
    } catch (error) {
        // Display the error message directly in the table
        let productListBody = document.getElementById("product-list-body");
        productListBody.innerHTML = ''; // Clear existing rows

        let row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" class="error-message">${error.message}</td>`;
        productListBody.appendChild(row);
    }
}
