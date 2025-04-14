import {AdminProductAPI} from "./AdminAPI/AdminProductAPI.js";
import {Product} from "../model/Product.js";

$(document).ready(function () {

    $('.nav__link').click(function () {
        $('.nav__link').removeClass('active-link');
        $(this).addClass('active-link');
    });

    function showMenu(toggleId, navbarId) {
        const $toggle = $('#' + toggleId);
        const $navbar = $('#' + navbarId);

        if ($toggle.length && $navbar.length) {
            $toggle.click(function () {
                $navbar.toggleClass('show-menu');
                $toggle.toggleClass('rotate-icon');
            });
        }
    }

    showMenu('nav-toggle', 'nav');
});

function loadProducts() {
    const api = new AdminProductAPI();

    api.getAll()
        .then(products => {
            console.log("Products loaded:", products);
            populateProductTable(products);
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}

function populateProductTable(products) {
    const $tableBody = $("#productTableBody");
    $tableBody.empty();

    products.forEach((product, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${product.imageUrl || 'https://via.placeholder.com/50'}" alt="Product Image" class="table-img"></td>
                <td>${product.name}</td>
                <td>${product.stockAvailability || 'N/A'}</td>
                <td>${product.price || 'N/A'}</td>
                <td>${product.location || 'N/A'}</td>
                <td>${product.type || 'N/A'}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${product.productId}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product.productId}">Delete</button>
                </td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

$("#imageUpload").on("change", async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dtbzvtpby/image/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        $("#previewImage").attr("src", data.secure_url);
        $("#imageUpload").val(data.secure_url);

        console.log("Image uploaded successfully:", data.secure_url);
    } catch (error) {
        console.error("Error uploading image:", error);
    }

});

$('#Save-Product-Button').on('click', async (event) => {
    event.preventDefault();
    const newProduct = new Product(
        "",
        $('#name').val(),
        $('#scientificName').val(),
        $('#seasonality').val(),
        $('#location').val(),
        $('#uses').val(),
        $('#description').val(),
        $('#productType').val(),
        $('#healthBenefits').val(),
        $('#mapCoordinates').val(),
        $('#price').val(),
        $('#stockAvailability').val(),
        $("#previewImage").attr("src")
    )

    const api = new AdminProductAPI();
    try {
        const response = await api.create(newProduct)
        console.log("API Response:", response);
        Swal.fire({
            icon: 'success',
            title: 'Product Created!',
            text: 'Your Product has been successfully created.',
        }).then(() => {
            $("#productForm")[0].reset(); // Reset form fields
            $("#previewImage").attr("src", ""); // Reset image preview
            $("#productModal").modal("hide"); // Hide modal after update
            window.location.reload();
        });
    } catch (error) {
        console.error('Error creating article:', error);
        Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }

});

$(document).on("click", ".edit-btn", async function () {
    const productID = $(this).data("id");
    const api = new AdminProductAPI();
    try{
    const product = await api.getById(productID);
        $('#name').val(product.name),
        $('#scientificName').val(product.scientificName),
        $('#seasonality').val(product.seasonality),
        $('#location').val(product.location),
        $('#uses').val(product.uses),
        $('#description').val(product.description),
        $('#productType').val(product.type),
        $('#healthBenefits').val(product.healthBenefits),
        $('#mapCoordinates').val(product.mapCoordinates),
        $('#price').val(product.price),
        $('#stockAvailability').val(product.stockAvailability),
        $("#previewImage").attr("src", product.imageUrl)
        $("#productModalLabel").text("Edit Article");
        $("#Update-Product-Button").data("id", productID);
        $("#productModal").modal("show");

    } catch (error) {
        console.error("Error loading article for editing:", error);
    }
});

$('#Update-Product-Button').on("click", async function () {
    const product = $(this).data("id");
    const api = new AdminProductAPI()
    const UpdatedProduct = new Product(
        product,
        $('#name').val(),
        $('#scientificName').val(),
        $('#seasonality').val(),
        $('#location').val(),
        $('#uses').val(),
        $('#description').val(),
        $('#productType').val(),
        $('#healthBenefits').val(),
        $('#mapCoordinates').val(),
        $('#price').val(),
        $('#stockAvailability').val(),
        $("#previewImage").attr("src")
    )

    try {
        await api.update(UpdatedProduct);
        Swal.fire({
            icon: 'success',
            title: 'Product Updated!',
            text: 'Your Product has been successfully updated.',
        }).then(() => {
            $("#productForm")[0].reset(); // Reset form fields
            $("#previewImage").attr("src", ""); // Reset image preview
            $("#productModal").modal("hide"); // Hide modal after update
            window.location.reload();
        });
    } catch (error) {
        console.error('Error updating article:', error);
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }
});

$(document).on("click", ".delete-btn", async function () {
    const productID = $(this).data("id");
    const api = new AdminProductAPI();
    try{
        const response = await api.delete(productID);
        console.log("API Response:",response)
        Swal.fire({
            icon: 'delete',
            title: 'Product Deleted!',
            text: 'Your Product has been successfully deleted.',
        }).then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }
});


$(document).ready(function () {
    loadProducts();
});

