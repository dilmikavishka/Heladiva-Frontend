import {Order} from "./model/Order.js";
import {OrderAPI} from "./api/OrderAPI.js";

$(document).ready(function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let $orderSummary = $("#order-summary-items");
    let total = 0;
    let deliveryFee = 250.00;
    let taxRate = 0.05;
    let tripDuration = 7;

    if (cart.length === 0) {
        $orderSummary.html("<p>Your cart is empty.</p>");
    } else {
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            tripDuration += item.duration || 0;

            let orderItem = `
                <div class="summary-item">
                    <span class="summary-label">${item.name}</span>
                    <span class="summary-value">LKR ${itemTotal.toFixed(2)}</span>
                </div>
            `;
            $orderSummary.append(orderItem);
        });
    }

    let taxAmount = total * taxRate;
    let orderTotal = total + deliveryFee + taxAmount;

    $("#trip-price").text(`LKR ${total.toFixed(2)}`);
    $("#trip-duration").text(`${Math.max(tripDuration, 7)} days`);
    $("#delivery-fee").text(`LKR ${deliveryFee.toFixed(2)}`);
    $("#tax-amount").text(`LKR ${taxAmount.toFixed(2)}`);
    $("#order-total").text(`LKR ${orderTotal.toFixed(2)}`);
});

$('#place-order-button').on('click', async (event) => {
    event.preventDefault();

    const orderId = "";
    const userId = JSON.parse(localStorage.getItem('user'))?.userId || "Guest";
    const orderDate = new Date().toISOString().split('T')[0];
    const firstName = $('#first-name').val();
    const lastName = $('#last-name').val();
    const addressLine1 = $('#address-line1').val();
    const apartmentSuite = $('#apartment-suite').val();
    const road = $('#road').val();
    const postalCode = $('#postal-code').val();
    const phone = $('#phone').val();
    const email = $('#email').val();

    const cardholderName = $('#cardholder-name').val();
    const cardNumber = $('#card-number').val();
    const expiryDate = $('#expiry-date').val();
    const cvc = $('#cvc').val();

    const tripPrice = parseFloat($('#trip-price').text().replace('LKR', '')) || 0;
    const tripDuration = parseInt($('#trip-duration').text().replace(' days', '')) || 0;
    const deliveryFee = parseFloat($('#delivery-fee').text().replace('LKR', '')) || 0;
    const taxAmount = parseFloat($('#tax-amount').text().replace('LKR', '')) || 0;
    const orderTotal = parseFloat($('#order-total').text().replace('LKR', '')) || 0;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart Data:", cart);
    let orderDetails = cart.map(item => ({
        productId: item.productId || "N/A",
        quantity: item.quantity || 1,
        price: item.price || 0,
    }));

    console.log("Order Details:", orderDetails);
    if (orderDetails.length === 0) {
        console.warn("Order details are empty! Cart might not be loaded correctly.");
    }

    const order = new Order(
        orderId, userId, orderDate, orderTotal, "Pending", orderDetails,
        firstName, lastName, addressLine1, apartmentSuite, road, postalCode,
        phone, email, cardholderName, cardNumber, expiryDate, cvc,
        tripPrice, tripDuration, deliveryFee, taxAmount
    );

    const api = new OrderAPI();
    try {
        await api.Order(order);
        Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            text: 'Your Order Placement has been successfully done.',
        }).then(() => {
            localStorage.removeItem("cart");
            window.location.reload();
        });
    } catch (error) {
        console.error('Error Placing Order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }
});
