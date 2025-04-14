import { AdminArticleAPI } from "./AdminAPI/AdminArticleAPI.js";
import {Article} from "../model/Article.js";

function LoadAllArticles() {
    const api = new AdminArticleAPI();

    api.getAll()
        .then(articles => {
            console.log(localStorage.getItem('user'));
            console.log("Articles loaded:", articles);
            populateTable(articles);
        })
        .catch(error => {
            console.error("Error loading articles:", error);
        });
}

function populateTable(articles) {
    const $tableBody = $("#articleTableBody");
    $tableBody.empty(); // Clear previous data

    articles.forEach((article, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${article.imageUrl || 'https://via.placeholder.com/50'}" alt="Article Image" class="table-img"></td>
                <td>${article.title}</td>
                <td>${article.scientificName}</td>
                <td>${article.seasonality}</td>
                <td>${article.location}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${article.articleId}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${article.articleId}">Delete</button>
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

$('#Save-Article-Button').on('click', async (event) => {
    event.preventDefault();
    console.log("Save button clicked"); // Debugging step

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error("User not found in localStorage");
        return;
    }

    const newArticle = new Article(
        "",
        $("#title").val(),
        $("#scientificName").val(),
        $("#seasonality").val(),
        $("#location").val(),
        $("#uses").val(),
        $("#description").val(),
        $("#healthBenefits").val(),
        $("#springCoordinates").val(),
        $("#summerCoordinates").val(),
        $("#autumnCoordinates").val(),
        $("#winterCoordinates").val(),
        user.userId,
        $("#publishedDate").val(),
        $("#tags").val(),
        $("#previewImage").attr("src")
    );

    const api = new AdminArticleAPI();
    try {
        const response = await api.create(newArticle);
        console.log("API Response:", response);
        Swal.fire({
            icon: 'success',
            title: 'Article Created!',
            text: 'Your article has been successfully created.',
        }).then(() => {
            $("#articleForm")[0].reset(); // Reset form fields
            $("#previewImage").attr("src", ""); // Reset image preview
            $("#articleModal").modal("hide"); // Hide modal after update
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

$(document).on("click", ".delete-btn", async function () {
    const articleId = $(this).data("id");
    const api = new AdminArticleAPI();
    try{
        const response = await api.delete(articleId);
        console.log("API Response:",response)
        Swal.fire({
            icon: 'delete',
            title: 'Article Deleted!',
            text: 'Your article has been successfully deleted.',
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

$(document).on("click", ".edit-btn", async function () {
    const articleId = $(this).data("id");
    const api = new AdminArticleAPI();

    try {
        const article = await api.getById(articleId);
        $("#title").val(article.title);
        $("#scientificName").val(article.scientificName);
        $("#seasonality").val(article.seasonality);
        $("#location").val(article.location);
        $("#uses").val(article.uses);
        $("#description").val(article.description);
        $("#healthBenefits").val(article.healthBenefits);
        $("#springCoordinates").val(article.springCoordinates);
        $("#summerCoordinates").val(article.summerCoordinates);
        $("#autumnCoordinates").val(article.autumnCoordinates);
        $("#winterCoordinates").val(article.winterCoordinates);
        $("#publishedDate").val(article.publishedDate || new Date().toISOString().split('T')[0]);
        $("#tags").val(article.tags);
        $("#authorId").val(article.authorId); // Set author ID
        $("#previewImage").attr("src", article.imageUrl || 'https://via.placeholder.com/100');
        $("#articleModalLabel").text("Edit Article");

        $("#Update-Article-Button").data("id", articleId);

        $("#articleModal").modal("show");
    } catch (error) {
        console.error("Error loading article for editing:", error);
    }
});

$('#Update-Article-Button').on("click", async function () {
    const articleId = $(this).data("id");

    if (!articleId) {
        console.error("Article ID is undefined.");
        return;
    }

    const api = new AdminArticleAPI();

    const updatedArticle = new Article(
        articleId,
        $("#title").val(),
        $("#scientificName").val(),
        $("#seasonality").val(),
        $("#location").val(),
        $("#uses").val(),
        $("#description").val(),
        $("#healthBenefits").val(),
        $("#springCoordinates").val(),
        $("#summerCoordinates").val(),
        $("#autumnCoordinates").val(),
        $("#winterCoordinates").val(),
        JSON.parse(localStorage.getItem('user')).userId,
        $("#publishedDate").val(),
        $("#tags").val(),
        $("#previewImage").attr("src")
    );


    try {
        await api.update(updatedArticle);
        Swal.fire({
            icon: 'success',
            title: 'Article Updated!',
            text: 'Your article has been successfully updated.',
        }).then(() => {
            $("#articleForm")[0].reset(); // Reset form fields
            $("#previewImage").attr("src", ""); // Reset image preview
            $("#articleModal").modal("hide"); // Hide modal after update
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

$(document).ready(LoadAllArticles);


