import { UserAPI } from "./api/UserAPI.js";
import { User } from "./model/User.js";

function setUserDetails() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        $('#userId').val(user.userId || '');
        $('#name').val(user.name || '');
        $('#email').val(user.email || '');
        $('#phone').val(user.phone || '');
        $('#address').val(user.address || '');
        $('#password').val('');
        $('#role').val(user.role || '');


        if (user.imageUrl) {
            $('#profileImage').attr('src', user.imageUrl);
        }
    }
}


$('#profileUpload').change(async function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_preset');

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dxk36sl3w/image/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        $('#profileImage').attr('src', data.secure_url);
        let user = JSON.parse(localStorage.getItem('user')) || {};
        user.profileImage = data.secure_url;
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error uploading image:', error);
    }
});

$('#togglePassword').click(function () {
    const passwordInput = $('#password');
    const icon = $('#passwordIcon');

    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text');
        icon.text('visibility_off');
    } else {
        passwordInput.attr('type', 'password');
        icon.text('visibility');
    }
});

$('#Update-Profile-Button').on('click', async (event) => {
    event.preventDefault();

    const api = new UserAPI();
    const userId = $('#userId').val();
    const name = $('#name').val();
    const password = $('#password').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const address = $('#address').val();
    const role = $('#role').val();
    const imageURl = $('#profileImage').attr('src');

    if (!userId || !name || !email || !phone || !address) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please fill all required fields!',
        });
        return;
    }

    const updatedUser = new User(userId, name, email, phone, password, address, role, imageURl);
    console.log(updatedUser);

    try {
        const response = await api.updateUser(updatedUser);
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile has been updated successfully.',
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: response.message || 'Something went wrong. Please try again.',
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message || 'Something went wrong. Please try again.',
        });
    }
});

$(document).ready(setUserDetails);
