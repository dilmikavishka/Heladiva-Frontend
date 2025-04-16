    import { ArticleAPI } from "./api/ArticleAPI.js";

    function loadArticles() {
        const api = new ArticleAPI();

        api.getAll()
            .then(articles => {
                console.log(localStorage.getItem('user'))
                console.log("Articles loaded:", articles);
                populatePlantList(articles);
            })
            .catch(error => {
                console.error("Error loading articles:", error);
            });
    }

    function populatePlantList(articles) {
        const plantList = document.querySelector('.plant-list');

        if (!plantList) return;

        plantList.innerHTML = '';

        articles.forEach(article => {
            const li = document.createElement('li');
            li.textContent = article.title;
            li.dataset.articleId = article.articleId;
            plantList.appendChild(li);
        });

        attachClickEvents();
    }

    function attachClickEvents() {
        const plantItems = document.querySelectorAll('.plant-list li');

        plantItems.forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.plant-list li').forEach(li => li.classList.remove('active'));
                this.classList.add('active');

                const articleId = this.dataset.articleId;
                fetchArticleById(articleId);
            });
        });
    }

    function fetchArticleById(articleId) {
        const api = new ArticleAPI();

        api.getById(articleId)
            .then(article => {
                updateContent(article);
            })
            .catch(error => {
                console.error("Error fetching article:", error);
            });
    }

    // function updateContent(article) {
    //     if (!article) return;
    //     document.getElementById("plant-info").style.display = "block";
    //     document.getElementById('article-title').textContent = article.title || 'Unknown Title';
    //     document.querySelector('.content img').src = article.imageUrl || '../images/default.jpg';
    //
    //     const fields = [
    //         { selector: '.content p:nth-child(2)', label: 'Scientific Name', value: article.scientificName },
    //         { selector: '.content p:nth-child(3)', label: 'Seasons', value: article.seasonality },
    //         { selector: '.content p:nth-child(4)', label: 'Locations', value: article.location },
    //         { selector: '.content p:nth-child(5)', label: 'Uses', value: article.uses },
    //         { selector: '.content p:nth-child(6)', label: 'Description', value: article.description },
    //         { selector: '.content p:nth-child(7)', label: 'Health Benefits', value: article.healthBenefits },
    //     ];
    //
    //     fields.forEach(field => {
    //         const element = document.querySelector(field.selector);
    //         if (element) {
    //             element.textContent = `${field.label}: ${field.value || 'Info coming soon'}`;
    //             element.dataset.originalText = element.textContent;
    //     });
    //
    //     const benefitsList = document.querySelector('.content ul');
    //     if (benefitsList) {
    //         benefitsList.innerHTML = '';
    //         if (article.healthBenefits) {
    //             article.healthBenefits.split(',').forEach(benefit => {
    //                 const li = document.createElement('li');
    //                 li.textContent = benefit.trim();
    //                 li.dataset.originalText = li.textContent;
    //                 benefitsList.appendChild(li);
    //             });
    //         } else {
    //             benefitsList.innerHTML = '<li>Info coming soon</li>';
    //         }
    //     }
    //
    //     updateMap(article.springCoordinates);
    //
    //     const seasonSelect = document.getElementById('season-select');
    //     seasonSelect.onchange = function () {
    //         const season = seasonSelect.value;
    //         let coordinates;
    //
    //         switch (season) {
    //             case 'spring':
    //                 coordinates = article.springCoordinates;
    //                 break;
    //             case 'summer':
    //                 coordinates = article.summerCoordinates;
    //                 break;
    //             case 'autumn':
    //                 coordinates = article.autumnCoordinates;
    //                 break;
    //             case 'winter':
    //                 coordinates = article.winterCoordinates;
    //                 break;
    //         }
    //
    //         updateMap(coordinates);
    //     };
    //
    //     if (isSinhala) translateContent();
    // }
    //
    // function updateMap(coordinates) {
    //     if (!coordinates) return;
    //
    //     const mapFrame = document.getElementById('article-map');
    //     if (mapFrame) {
    //         const [lat, lng] = coordinates.split(',').map(coord => coord.trim());
    //         mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAD67xxpe4hEjA10tA3d38V414Jot0M9q0&q=${lat},${lng}`;
    //     }
    // }
    //
    //
    //
    // const searchBar = document.getElementById('search-bar');
    // if (searchBar) {
    //     searchBar.addEventListener('input', function() {
    //         let filter = this.value.toLowerCase();
    //         document.querySelectorAll('.plant-list li').forEach(li => {
    //             if (li.textContent.toLowerCase().includes(filter)) {
    //                 li.style.display = '';
    //             } else {
    //                 li.style.display = 'none';
    //             }
    //         });
    //     });
    // }
    //
    //
    // const apiKey = "AIzaSyAFRGPIwE0QvjwHwPWMhhsAveOuM8GdHXo";
    // let isSinhala = false;
    //
    // document.getElementById("translate-btn").addEventListener("click", function () {
    //     isSinhala = !isSinhala;
    //     this.textContent = isSinhala ? "Switch to English" : "සිංහලට මාරු වන්න";
    //     translateContent();
    // });
    //
    // function translateContent() {
    //     const contentElements = document.querySelectorAll(".content p, .content h2,.content h2, .content li, .content option");
    //
    //     contentElements.forEach(async (element) => {
    //         const text = element.dataset.originalText || element.textContent;
    //         if (!text) return;
    //
    //         if (!element.dataset.originalText) {
    //             element.dataset.originalText = text;
    //         }
    //
    //         const targetLang = isSinhala ? "si" : "en";
    //         const translatedText = await translateText(text, targetLang);
    //         element.textContent = translatedText;
    //     });
    // }
    //
    // async function translateText(text, targetLang) {
    //     const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    //     const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             q: text,
    //             target: targetLang
    //         })
    //     });
    //
    //     const data = await response.json();
    //     return data.data.translations[0].translatedText;
    // }
    //
    // document.addEventListener("DOMContentLoaded", () => {
    //     const video = document.getElementById("background-video");
    //     const plantInfo = document.getElementById("plant-info");
    //     if (video && plantInfo) {
    //         video.style.display = "block";
    //         plantInfo.style.display = "none";
    //     }
    // });
    // loadArticles();

    function updateContent(article) {
        if (!article) return;

        document.getElementById("plant-info").style.display = "block";
        document.getElementById("article-title").textContent = article.title || "Unknown Title";
        document.querySelector(".content img").src = article.imageUrl || "../images/default.jpg";

        const fields = [
            { selector: ".content p:nth-child(2)", label: "Scientific Name", value: article.scientificName },
            { selector: ".content p:nth-child(3)", label: "Seasons", value: article.seasonality },
            { selector: ".content p:nth-child(4)", label: "Locations", value: article.location },
            { selector: ".content p:nth-child(5)", label: "Uses", value: article.uses },
            { selector: ".content p:nth-child(6)", label: "Description", value: article.description },
            { selector: ".content p:nth-child(7)", label: "Health Benefits", value: article.healthBenefits },
        ];

        fields.forEach(field => {
            const element = document.querySelector(field.selector);
            if (element) {
                element.textContent = `${field.label}: ${field.value || "Info coming soon"}`;
                element.dataset.originalText = element.textContent;
            }
        });

        const benefitsList = document.querySelector(".content ul");
        if (benefitsList) {
            benefitsList.innerHTML = "";
            if (article.healthBenefits) {
                article.healthBenefits.split(",").forEach(benefit => {
                    const li = document.createElement("li");
                    li.textContent = benefit.trim();
                    li.dataset.originalText = li.textContent;
                    benefitsList.appendChild(li);
                });
            } else {
                benefitsList.innerHTML = "<li>Info coming soon</li>";
            }
        }

        updateMap(article.springCoordinates);

        const seasonSelect = document.getElementById("season-select");
        seasonSelect.onchange = function () {
            const season = seasonSelect.value;
            let coordinates;

            switch (season) {
                case "spring":
                    coordinates = article.springCoordinates;
                    break;
                case "summer":
                    coordinates = article.summerCoordinates;
                    break;
                case "autumn":
                    coordinates = article.autumnCoordinates;
                    break;
                case "winter":
                    coordinates = article.winterCoordinates;
                    break;
            }

            updateMap(coordinates);
        };

        if (isSinhala) translateContent();
    }

    function updateMap(coordinates) {
        if (!coordinates) return;

        const mapFrame = document.getElementById("article-map");
        if (mapFrame) {
            const [lat, lng] = coordinates.split(",").map(coord => coord.trim());
            mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`;
        }
    }


    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", function () {
            const filter = this.value.toLowerCase();
            document.querySelectorAll(".plant-list li").forEach(li => {
                li.style.display = li.textContent.toLowerCase().includes(filter) ? "" : "none";
            });
        });
    }

    const apiKey = "AIzaSyAFRGPIwE0QvjwHwPWMhhsAveOuM8GdHXo";
    let isSinhala = false;

    document.getElementById("translate-btn").addEventListener("click", function () {
        isSinhala = !isSinhala;
        this.textContent = isSinhala ? "Switch to English" : "සිංහලට මාරු වන්න";
        translateContent();
    });

    function translateContent() {
        const contentElements = document.querySelectorAll(".content p, .content h2, .content li, .content option");

        contentElements.forEach(async (element) => {
            const text = element.dataset.originalText || element.textContent;
            if (!text) return;

            if (!element.dataset.originalText) {
                element.dataset.originalText = text;
            }

            const targetLang = isSinhala ? "si" : "en";
            const translatedText = await translateText(text, targetLang);
            element.textContent = translatedText;
        });
    }

    async function translateText(text, targetLang) {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, target: targetLang })
        });

        const data = await response.json();
        return data.data.translations[0].translatedText;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const video = document.getElementById("background-video");
        const plantInfo = document.getElementById("plant-info");

        if (video && plantInfo) {
            video.style.display = "block";
            plantInfo.style.display = "none";
        }
    });


    loadArticles();

