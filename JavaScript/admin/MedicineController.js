import { AdminMedicineAPI } from "./AdminAPI/AdminMedicineAPI.js";
import { Medicine } from "../model/Medicine.js";

$(document).ready(function () {
    LoadAllMedicines();
});

function LoadAllMedicines() {
    const api = new AdminMedicineAPI();

    api.getAll()
        .then(medicines => {
            console.log("Medicines loaded:", medicines);
            populateTable(medicines);
        })
        .catch(error => {
            console.error("Error loading medicines:", error);
        });
}

function populateTable(medicines) {
    const tableBody = $("#MedicalTableBody");
    tableBody.empty();

    medicines.forEach((medicine, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${medicine.medicineId}</td>
                <td>${medicine.name}</td>
                <td>${medicine.disease}</td>
                <td>${medicine.description}</td>
                <td>${medicine.preparation}</td>
                <td>${medicine.usageInstructions}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${medicine.medicineId}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${medicine.medicineId}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}
$("#Save-Medicine-Button").on("click", async function (event) {
    event.preventDefault(); // Prevent default form submission

    try {
        const medicineData = new Medicine(
            "",
            $("#medicineName").val().trim(),
            $("#disease").val().trim(),
            $("#description").val().trim(),
            $("#allergies").val().trim(),
            $("#ingredients").val().trim().split(",").map(item => item.trim()),
            $("#preparation").val().trim(),
            $("#usage").val().trim(),
            $("#sideEffects").val().trim().split(",").map(item => item.trim()),
            JSON.parse(localStorage.getItem("user")).userId
        );

        console.log("Extracted Medicine Data:", medicineData);

        const api = new AdminMedicineAPI();
        const response = await api.create(medicineData);

        console.log("API Response:", response);

        Swal.fire({
            icon: "success",
            title: "Common Cure Created!",
            text: "Your article has been successfully created.",
        }).then(() => {
            $("#medicineForm")[0].reset();
            $("#medicineModal").modal("hide");
            window.location.reload();
        });
    } catch (error) {
        console.error("Error creating Cure:", error);
        Swal.fire({
            icon: "error",
            title: "Creation Failed",
            text: error.message || "Something went wrong. Please try again.",
        });
    }
});

$("#Update-Medicine-Button").on("click", async function (event) {
event.preventDefault();

    try {
        const medicineData = new Medicine(
            $("#Save-Medicine-Button").data("id"),
            $("#medicineName").val().trim(),
            $("#disease").val().trim(),
            $("#description").val().trim(),
            $("#allergies").val().trim(),
            $("#ingredients").val().trim().split(",").map(item => item.trim()),
            $("#preparation").val().trim(),
            $("#usage").val().trim(),
            $("#sideEffects").val().trim().split(",").map(item => item.trim()),
            JSON.parse(localStorage.getItem("user")).userId
        );

        console.log("Extracted Medicine Data:", medicineData);

        const api = new AdminMedicineAPI();
        const response = await api.update(medicineData);

        console.log("API Response:", response);

        Swal.fire({
            icon: "success",
            title: "Common Cure Updated!",
            text: "Your article has been successfully updated.",
        }).then(() => {
            $("#medicineForm")[0].reset();
            $("#medicineModal").modal("hide");
            window.location.reload();
        });
    } catch (error) {
        console.error("Error updating Cure:", error);
        Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: error.message || "Something went wrong. Please try again.",
        });
    }
});

$(document).on("click", ".edit-btn", async function () {
    const medicineID = $(this).data("id");
    const api = new AdminMedicineAPI();
    try {
        const medicine = await api.getById(medicineID);
        $("#medicineName").val(medicine.name);
        $("#disease").val(medicine.disease);
        $("#description").val(medicine.description);
        $("#allergies").val(medicine.allergies);
        $("#ingredients").val(medicine.ingredients.join(","));
        $("#preparation").val(medicine.preparation);
        $("#usage").val(medicine.usageInstructions);
        $("#sideEffects").val(medicine.sideEffects.join(","));
        $("#authorId").val(medicine.authorId);
        $("#Save-Medicine-Button").attr("data-id", medicineID);
        $("#medicineModal").modal("show");
    } catch (error) {
        console.error("Error loading medicine:", error);
    }
});

$(document).on("click", ".delete-btn", async function () {
    const medicineID = $(this).data("id");
    const api = new AdminMedicineAPI();
    try {
        const response = await api.delete(medicineID);
        console.log("API Response:", response);
        Swal.fire({
            icon: "delete",
            title: "Common Cure Deleted!",
            text: "Your article has been successfully deleted.",
        }).then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error("Error deleting medicine:", error);
        Swal.fire({
            icon: "error",
            title: "Deletion Failed",
            text: error.message || "Something went wrong. Please try again.",
        });
    }
});


