import {ProductAPI} from "./api/ProductAPI.js";

$(document).ready(function () {
    function populateProductCards(products) {
        let $productContainer = $(".product-container");
        $productContainer.empty();

        products.forEach(product => {
            let productCard = `
                    <div class="product-card">
                        <div class="product-image-container">
                            <div class="product-made">${product.location || "Unknown Origin"}</div>
                            <img src="${product.imageUrl || '../images/default.png'}" alt="Product Image" class="product-image">
                        </div>
                        <div class="product-info">
                            <div class="product-type">${product.type || "Unknown Type"}</div>
                            <div class="product-name">${product.name || "No Name"}</div>
                            <div class="product-price">LKR ${product.price || "N/A"}</div>
                        </div>
                        <div class="cart-icon">
                                <span class="material-icons ">add_shopping_cart</span>
                        </div>
                    </div>
                `;
            $productContainer.append(productCard);
        });
    }

    function loadProducts() {
        const api = new ProductAPI();
        api.getAll()
            .then(products => {
                console.log("Products loaded:", products);
                populateProductCards(products);
            })
            .catch(error => {
                console.error("Error loading products:", error);
            });
    }


    function filterProducts() {
        let typeFilter = $(".sidebar input[placeholder='Enter type']").val().toLowerCase();
        let nameFilter = $(".sidebar input[placeholder='Enter name']").val().toLowerCase();
        let priceFilter = $(".sidebar input[placeholder='Max price']").val();

        $(".product-card").each(function () {
            let type = $(this).find(".product-type").text().toLowerCase();
            let name = $(this).find(".product-name").text().toLowerCase();
            let price = parseInt($(this).find(".product-price").text().replace(/[^\d]/g, ""), 10);

            let typeMatch = type.includes(typeFilter) || typeFilter === "";
            let nameMatch = name.includes(nameFilter) || nameFilter === "";
            let priceMatch = !priceFilter || price <= parseInt(priceFilter, 10);

            $(this).toggle(typeMatch && nameMatch && priceMatch);
        });
    }

    $(".sidebar input").on("input", filterProducts);

    loadProducts();
});