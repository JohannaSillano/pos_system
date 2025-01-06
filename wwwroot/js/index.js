async function searchProduct() {
    let query = document.getElementById("search-bar").value;

    // If the search bar is empty or null, call the EmptySearchBar action to fetch all products
    if (!query || query.trim() === "") {
        let response = await fetch(`/Home/EmptySearchBar`); // Call EmptySearchBar
        let products = await response.json();

        let productListBody = document.getElementById("product-list-body");
        productListBody.innerHTML = '';

        if (products && products.length > 0) {
            products.forEach(product => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>₱${product.price.toFixed(2)}</td>
                    <td><button class="btn-select" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Select</button></td>
                `;
                productListBody.appendChild(row);
            });
        } else {
            let row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">No products available.</td>`;
            productListBody.appendChild(row);
        }
    } else {
        // If there's a query, call SearchProducts action to fetch the products based on the query
        let response = await fetch(`/Home/SearchProducts?query=${encodeURIComponent(query)}`);
        let products = await response.json();

        let productListBody = document.getElementById("product-list-body");
        productListBody.innerHTML = '';

        if (products && products.length > 0) {
            products.forEach(product => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>₱${product.price.toFixed(2)}</td>
                    <td><button class="btn-select" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Select</button></td>
                `;
                productListBody.appendChild(row);
            });
        } else {
            let row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">No products found.</td>`;
            productListBody.appendChild(row);
        }
    }
}