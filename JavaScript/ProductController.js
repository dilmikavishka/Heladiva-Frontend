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

            <div class="quantity-cart-container">
                <div class="quantity-container">
                    <button class="quantity-btn minus" onclick="updateQuantity('${product.productId}', -1)">-</button>
                    <span id="quantity-${product.productId}" class="quantity">1</span>
                    <button class="quantity-btn plus" onclick="updateQuantity('${product.productId}', 1)">+</button>
                </div>
                <button class="cart-button" onclick="addToCart('${product.productId}')">
                    <span class="material-icons">shopping_cart</span> Add to Cart
                </button>
            </div>
        </div>
    </div>
    `;
            $productContainer.append(productCard);
        });
    }

    window.updateQuantity = function (productId, change) {
        let quantityElement = document.getElementById(`quantity-${productId}`);
        let currentQuantity = parseInt(quantityElement.innerText);
        if (currentQuantity + change > 0) {
            quantityElement.innerText = currentQuantity + change;
        }
    };


    let cart = [];

    window.addToCart = function (productId) {
        let quantityElement = document.getElementById(`quantity-${productId}`);
        let quantity = parseInt(quantityElement.innerText);

        let productCard = $(`button[onclick="addToCart('${productId}')"]`).closest('.product-card');
        let productName = productCard.find('.product-name').text();
        let productPrice = parseFloat(productCard.find('.product-price').text().replace("LKR ", ""));

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingProduct = cart.find(item => item.productId === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ productId, name: productName, price: productPrice, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // Store in localStorage
        updateCartUI();

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${productName} has been added to your cart!`,
            showConfirmButton: false,
            timer: 1500
        });
    };


    function updateCartUI() {
        let cart = JSON.parse(localStorage.getItem("cart")) || []; // Fetch cart data
        let $cartItems = $(".cart-items");
        $cartItems.empty();
        let total = 0;

        cart.forEach(item => {
            let cartItem = `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-quantity">x${item.quantity}</span>
            </div>
        `;
            total += item.price * item.quantity;
            $cartItems.append(cartItem);
        });

        $("#cart-total").text(`LKR ${total.toFixed(2)}`);
    }



    $("#cart-toggle").click(function () {
        $("#cart").fadeIn();
    });

    $("#cart-close").click(function () {
        $("#cart").fadeOut();
    });


    $("#checkout-button").click(() =>{
        window.location.href = "checkout.html";
    })


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
