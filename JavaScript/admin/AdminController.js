import { AdminMedicineAPI } from "./AdminAPI/AdminMedicineAPI.js";
import { AdminArticleAPI } from "./AdminAPI/AdminArticleAPI.js";
import { AdminProductAPI } from "./AdminAPI/AdminProductAPI.js";
import { AdminOrderAPI } from "./AdminAPI/AdminOrderAPI.js";

const ArticleApi = new AdminArticleAPI();
const ProductApi = new AdminProductAPI();
const MedicineApi = new AdminMedicineAPI();
const OrderApi = new AdminOrderAPI();

function loadArticles() {
    ArticleApi.getAll().then(articles => {
        let articleTableBody = $('#articleTable tbody');
        articles.slice(0, 4).forEach(article => {
            articleTableBody.append(`
                <tr>
                    <td>${article.articleId}</td>
                    <td>${article.title}</td>
                 
                </tr>
            `);
        });
    });
}

function loadCard(){
    ProductApi.getAll().then(products => {
        let productTableBody = $('#productTable tbody');
        let productCount = products.length;
        // Update product count card
        $('#ProductCount').text(productCount);
    });

    MedicineApi.getAll().then(medicines => {
        let medicineTableBody = $('#medicineTable tbody');
        let medicineCount = medicines.length;
        // Update medicine count card
        $('#RemedyCount').text(medicineCount);

    });

}

function loadOrders() {
    OrderApi.getAll().then(orders => {
        let orderTableBody = $('#orderTable tbody');
        let orderCount = orders.length;
        // Update order count card
        $('#orderCount').text(orderCount);


        orders.slice(0, 4).forEach(order => {
            orderTableBody.append(`
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.orderId}</td>
                    <td>${order.userId}</td>
                    <td>${order.status}</td>
                </tr>
            `);
        });


        const orderStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

            const statusColorMap = {
                "Shipped": "#78bb7b",
                "Pending": "#ff9800",
                "Delivered": "#2196f3",
                "Cancelled": "#f44336"
            };

            const chartLabels = Object.keys(orderStatus);
            const chartData = Object.values(orderStatus);
            const chartBackgroundColors = chartLabels.map(status => statusColorMap[status] || '#cccccc'); // Default gray for unknown statuses

            const ctx = document.getElementById('orderChart').getContext('2d');
        const orderChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Orders by Status',
                    data: chartData,
                    backgroundColor: chartBackgroundColors,
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    barPercentage: 0.2,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


    });
}



function loadMedicines() {
    MedicineApi.getAll().then(medicines => {
        let medicineTableBody = $('#medicineTable tbody');
        medicines.slice(0, 4).forEach(medicine => {
            medicineTableBody.append(`
                <tr>
                    <td>${medicine.medicineId}</td>
                    <td>${medicine.name}</td>
                    <td>${medicine.description}</td>
                </tr>
            `);
        });
    });
}

$(document).ready(function() {
    loadArticles();
    loadOrders();
    loadMedicines();
    loadCard();
});

const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    linkColor.forEach(l => l.classList.remove('active-link'))
    this.classList.add('active-link')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))
const showMenu = (toggleId, navbarId) =>{
    const toggle = document.getElementById(toggleId),
        navbar = document.getElementById(navbarId)

    if(toggle && navbar){
        toggle.addEventListener('click', ()=>{
            /* Show menu */
            navbar.classList.toggle('show-menu')
            /* Rotate toggle icon */
            toggle.classList.toggle('rotate-icon')
        })
    }
}
showMenu('nav-toggle','nav')