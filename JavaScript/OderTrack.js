import { OrderAPI } from "./api/OrderAPI.js";

$(document).ready(function () {
    $("#search-order").keypress(async function (event) {
        if (event.which === 13) {
            event.preventDefault();
            let orderId = $(this).val().trim();
            if (orderId === "") {
                console.log("No Order ID entered!");
                return;
            }

            const api = new OrderAPI();
            await api.getById(orderId)
                .then(data => {
                    console.log("Order Data:", data);
                    updateOrderDetails(data);
                })
                .catch(error => {
                    console.error("Error fetching order by ID:", error);
                });
            console.log("Entered Order ID:", orderId);
        }
    });
});

function updateOrderDetails(data) {
    $("#buyer-name").text(data.firstName + " " + data.lastName);
    $("#buyer-address").text(data.addressLine1 + ", ");
    $("#buyer-road").text(data.road + ", ");
    $("#buyer-apartment").text(data.apartmentSuite + ", ");
    $("#buyer-phone").text(data.phone + ", ");

    $("#product-price").text("LKR " + data.totalPrice);
    $("#delivery-fee").text("LKR " + data.deliveryFee);
    $("#tax").text("LKR " + data.tax);
    $("#total-price").text("LKR " + (parseFloat(data.totalPrice) + parseFloat(data.deliveryFee) + parseFloat(data.tax)));

    let orderItemsHtml = "";
    data.orderDetails.forEach(item => {
        orderItemsHtml += `
        <div class="product-card">
            <div class="product-info">
                <p><strong>Product ID:</strong> ${item.productId}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Price:</strong> LKR ${item.price}</p>
            </div>
        </div>`;
    });
    $("#order-items").html(orderItemsHtml);

    updateOrderStatus(data.status);
}


function updateOrderStatus(status) {
    $(".order-status").removeClass("active").css("border", "none");
    if (status === "Pending") {
        $(".order-status:nth-child(1)").addClass("active").css("border", "4px solid orange");
    } else if (status === "Processed") {
        $(".order-status:nth-child(1)").css("border", "4px solid orange");
        $(".order-status:nth-child(2)").addClass("active").css("border", "4px solid #82e386");
    } else if (status === "Shipped") {
        $(".order-status:nth-child(1)").css("border", "4px solid orange");
        $(".order-status:nth-child(2)").css("border", "4px solid orange");
        $(".order-status:nth-child(3)").addClass("active").css("border", "4px solid #82e386");
    } else if (status === "Delivered") {
        $(".order-status").addClass("active").css("border", "4px solid #82e386");
    }
}
