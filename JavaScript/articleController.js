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



function updateContent(article) {
    if (!article) return;


    const titleElement = document.getElementById('article-title');
    if (titleElement) {
        titleElement.textContent = article.title || 'Unknown Title';
    }


    const imageElement = document.querySelector('.content img');
    if (imageElement) {
        imageElement.src = article.imageUrl || '../images/default.jpg';
        imageElement.alt = article.title || 'Image';
    }


    const fields = [
        { selector: '.content p:nth-child(2)', label: 'Scientific Name', value: article.scientificName },
        { selector: '.content p:nth-child(3)', label: 'Seasons', value: article.seasonality },
        { selector: '.content p:nth-child(4)', label: 'Locations', value: article.location },
        { selector: '.content p:nth-child(5)', label: 'Uses', value: article.uses },
        { selector: '.content p:nth-child(6)', label: 'Description', value: article.description },
        { selector: '.content p:nth-child(7)', label: 'Health Benefits', value: article.healthBenefits },
    ];

    fields.forEach(field => {
        const element = document.querySelector(field.selector);
        if (element) {
            element.innerHTML = `<strong>${field.label}:</strong> ${field.value || 'Info coming soon'}`;
        }
    });


    const benefitsList = document.querySelector('.content ul');
    if (benefitsList) {
        benefitsList.innerHTML = '';
        if (article.healthBenefits) {
            article.healthBenefits.split(',').forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit.trim();
                benefitsList.appendChild(li);
            });
        } else {
            benefitsList.innerHTML = '<li>Info coming soon</li>';
        }
    }
}



const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', function() {
        let filter = this.value.toLowerCase();
        document.querySelectorAll('.plant-list li').forEach(li => {
            if (li.textContent.toLowerCase().includes(filter)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
    });
}

loadArticles();
