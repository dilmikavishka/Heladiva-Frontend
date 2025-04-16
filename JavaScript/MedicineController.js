import { MedicineAPI } from "./api/MedicineAPI.js";

const TRANSLATE_API_KEY = "AIzaSyAFRGPIwE0QvjwHwPWMhhsAveOuM8GdHXo";
const TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";

$(document).ready(function () {
    loadMedicines();
});

function loadMedicines() {
    let medicineAPI = new MedicineAPI();

    medicineAPI.getAll()
        .then(medicines => {
            populateMedicineCards(medicines);
        })
        .catch(error => {
            console.error("Error loading medicines:", error);
        });
}

$('#translateButton').on('click', function () {
    translateMedicineText()
});

function populateMedicineCards(medicines) {
    let container = $("#medicineCardContainer");
    container.empty();

    medicines.forEach(medicine => {
        let card = `
            <div class="col-md-4">
                <div class="card medicine-card" data-id="${medicine.medicineId}">
                    <div class="card-body">
                        <h5 class="card-title">${medicine.name}</h5>
                        <p class="card-text"><strong>Disease:</strong> <span class="text-original">${medicine.disease}</span></p>
                        <p class="card-text"><strong>Usage:</strong> <span class="text-original">${medicine.usageInstructions}</span></p>
                        <button class="btn btn-primary view-details" data-id="${medicine.medicineId}" 
                            data-bs-toggle="modal" data-bs-target="#medicineModal">
                            View Details
                        </button>
                        <button class="btn btn-success translate" data-id="${medicine.medicineId}">
                            <i class="material-icons">translate</i> Translate to Sinhala
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });

    $(".view-details").on("click", function () {
        let medicineId = $(this).data("id");
        fetchMedicineDetails(medicineId);
    });


    $(".translate").on("click", function () {
        let card = $(this).closest(".medicine-card");
        translateMedicineText(card);
    });
}
$("#translateButton").on("click", function () {
    let modal = $("#medicineModal");

    let textsToTranslate = [];
    modal.find("span").each(function () {
        textsToTranslate.push($(this).text());
    });

    if (textsToTranslate.length === 0) return;
    fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: textsToTranslate,
            target: "si",
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.translations) {
                let translatedTexts = data.data.translations.map(t => t.translatedText);
                modal.find("span").each(function (index) {
                    $(this).text(translatedTexts[index]);
                });
                $("#translateButton").html('<i class="material-icons">g_translate</i> Translated');
                $("#translateButton").prop("disabled", true);
            }
        })
        .catch(error => console.error("Translation error:", error));
});


function fetchMedicineDetails(medicineId) {
    let medicineAPI = new MedicineAPI();

    medicineAPI.getById(medicineId)
        .then(medicine => {
            openMedicineModal(medicine);
        })
        .catch(error => {
            console.error("Error fetching medicine details:", error);
        });
}

function openMedicineModal(medicine) {
    $("#modalMedicineName").text(medicine.name);
    $("#modalDisease").text(medicine.disease);
    $("#modalDescription").text(medicine.description);
    $("#modalAllergies").text(medicine.allergies || "None");
    $("#modalIngredients").text(medicine.ingredients.join(", "));
    $("#modalPreparation").text(medicine.preparation);
    $("#modalUsage").text(medicine.usageInstructions);
    $("#modalSideEffects").text(medicine.sideEffects.join(", ") || "None");

    $("#medicineModal").modal("show");
}

function translateMedicineText(card = null) {
    let textsToTranslate = [];

    if ($("#medicineModal").hasClass("show")) {
        $("#medicineModal .text-original").each(function () {
            textsToTranslate.push($(this).text());
        });
    } else if (card) {
        card.find(".text-original").each(function () {
            textsToTranslate.push($(this).text());
        });
    }

    if (textsToTranslate.length === 0) return;


    fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: textsToTranslate,
            target: "si",
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.translations) {
                let translatedTexts = data.data.translations.map(t => t.translatedText);

                if ($("#medicineModal").hasClass("show")) {
                    $("#medicineModal .text-original").each(function (index) {
                        $(this).text(translatedTexts[index]);
                    });
                } else if (card) {
                    card.find(".text-original").each(function (index) {
                        $(this).text(translatedTexts[index]);
                    });
                }
            }
        })
        .catch(error => console.error("Translation error:", error));
}


$(document).ready(function () {
    $("#searchInput").on("keypress", function (event) {
        if (event.which === 13) {
            let value = $(this).val().toLowerCase();
            $(".medicine-card").each(function () {
                $(this).toggle($(this).text().toLowerCase().includes(value));
            });
        }
    });
});
