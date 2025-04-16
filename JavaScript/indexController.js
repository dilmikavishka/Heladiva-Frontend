import {LoginAPI} from "./api/LoginAPI.js";
import {SignIn} from "./model/SignIn.js";
import {SignUp} from "./model/SignUp.js";
import {ProductAPI} from "./api/ProductAPI.js";
import {ContactAPI} from "./api/ContactAPI.js";

$('#signInButton').on('click', async (event) => {
    event.preventDefault();

    const email = $('#emailInput').val();
    const password = $('#passwordInput').val();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    const signInModel = new SignIn(email, password);
    const api = new LoginAPI();

    try {
        const response = await api.login(signInModel);
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            Swal.fire({
                icon: "success",
                title: "Signup Successful",
                text: "Your account has been Logged In!",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "./pages/Home.html";
            });

        } else {
            alert("Invalid credentials");
            Swal.fire({
                icon: "error",
                title: "SignIn Failed",
                text: "Something went wrong. Please try again.",
                customClass: {
                    popup: 'whatsapp-alert'
                }
            });
        }
    } catch (error) {
        console.error("Signup failed:", error);
        Swal.fire({
            icon: "error",
            title: "SignIn Error",
            text: "An error occurred. Please try again.",
            customClass: {
                popup: 'whatsapp-alert'
            }
        });
    }
});

$(document).ready(function () {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user.role;
    if (user.imageUrl) {
        $('#nav-bar-profile-image').attr('src', user.imageUrl);
    }
    const navbarNav = $(".navbar-nav");
    if (userRole === "Admin") {
        const adminLinks = `
            <li class="nav-item"><a class="nav-link" href="../admin/admin.html">Admin DB</a></li>
        `;
        navbarNav.find(".user-profile").before(adminLinks);
    }

    const api = new ProductAPI();
    api.getAll().then((products) => {
        const productContainer = $(".product-section .row");
        productContainer.empty(); // Clear any existing content

        products.slice(0, 3).forEach(product => {
            const productCard = `
                <div class="col-md-4">
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </div>
                        <h5 class="product-title">${product.name}</h5>
                        <p class="product-price">Rs.${product.price}</p>
                    </div>
                </div>
            `;
            productContainer.append(productCard);
        });
    }).catch(error => console.error("Error fetching products:", error));
});

$("#send-message").on('click',async function (event) {
    event.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const message = $("#message").val();

    if (!name || !email || !message) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'All fields are required!'
        });
        return;
    }

    const api = new ContactAPI();
    try {
        const response = await api.sendMessage({
            name: name,
            email: email,
            message: message
        });

        if (response.success) {
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Your message has been sent successfully!',
                timer: 2000,
                showConfirmButton: false
            });

            $("#name").val("")
            $("#email").val("")
            $("#message").val("")
        } else {
            throw new Error(response.message || "Something went wrong");
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message
        });
    }
});

$('#signUpButton').on('click', async (event) => {
    event.preventDefault();

    const email = $('#SignUpEmailInput').val();
    const password = $('#SignUpPasswordInput').val();
    const role = $('#SignUpRoleSelect').val();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    const signUpModel = new SignUp(email, password, role);
    const api = new LoginAPI();

    try {
        const response = await api.register(signUpModel);
        if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            Swal.fire({
                icon: "success",
                title: "Signup Successful",
                text: "Your account has been Logged In!",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                window.location.reload();
            });

        } else {
            alert("SignUp Invalid");
            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: "Something went wrong. Please try again.",
                customClass: {
                    popup: 'whatsapp-alert'
                }
            });
        }
    } catch (error) {
        console.error("Signup failed:", error);
        Swal.fire({
            icon: "error",
            title: "Signup Error",
            text: "An error occurred. Please try again.",
            customClass: {
                popup: 'whatsapp-alert'
            }
        });
    }
});




