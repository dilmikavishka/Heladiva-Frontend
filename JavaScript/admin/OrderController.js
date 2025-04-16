import { AdminOrderAPI } from "./AdminAPI/AdminOrderAPI.js";

function LoadAllOrders() {
    const api = new AdminOrderAPI();

    api.getAll()
        .then(Orders => {
            console.log(localStorage.getItem('user'));
            console.log("Orders loaded:", Orders);
            populateTable(Orders);
        })
        .catch(error => {
            console.error("Error loading articles:", error);
        });
}

function populateTable(Orders) {
    const $tableBody = $("#OrderTableBody");
    $tableBody.empty(); // Clear previous data

    Orders.forEach((order, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${order.orderId}</td>
                <td>${order.firstName} ${order.lastName}</td>
                <td>${order.totalPrice}</td>
                <td>${order.addressLine1} ${order.apartmentSuite} ${order.road}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${order.orderId}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${order.orderId}">Delete</button>
                </td>
            </tr>
        `;
        $tableBody.append(row);
    });
}
LoadAllOrders();


$(".nav__link").on("click", function() {
    $(".nav__link").removeClass("active-link");
    $(this).addClass("active-link");
});

function showMenu(toggleId, navbarId) {
    const $toggle = $("#" + toggleId);
    const $navbar = $("#" + navbarId);

    if ($toggle.length && $navbar.length) {
        $toggle.on("click", function() {
            $navbar.toggleClass("show-menu");
            $toggle.toggleClass("rotate-icon");
        });
    }
}
showMenu("nav-toggle", "nav");

$(document).on("click", ".edit-btn", async function () {
    const oderID = $(this).data("id");
    const api = new AdminOrderAPI();
    try {
        await api.getById(oderID)
            .then(order => {
                console.log("Order loaded for editing:", order);
                $('#OrderID').val(order.orderId);
                $('#FirstName').val(order.firstName);
                $('#LastName').val(order.lastName);
                $('#TotalPrice').val(order.totalPrice);
                $('#AddressLine1').val(order.addressLine1);
                $('#ApartmentSuite').val(order.apartmentSuite);
                $('#Road').val(order.road);
                $('#Status').val(order.status);
                $("#orderModalLabel").text("Edit Article");

                $("#Update-Order-Button").data("id", oderID);

                $("#orderModal").modal("show");
            })
            .catch(error => {
                console.error("Error loading order for editing:", error);
            });
    } catch (error) {
        console.error("Error loading article for editing:", error);
    }
});

$('#Update-Order-Button').on("click", async function () {
    const OrderID = $(this).data("id");
    const status = $('#Status').val();
    const api = new AdminOrderAPI();
    try {
        await api.updateStatus(OrderID,status);
        Swal.fire({
            icon: 'success',
            title: 'Order Updated!',
            text: 'Your Order has been successfully updated.',
        }).then(() => {
            $("#editOrderForm")[0].reset();
            $("#orderModal").modal("hide");
            window.location.reload();
        });
    } catch (error) {
        console.error('Error updating Order:', error);
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }
});
