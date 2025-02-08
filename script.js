
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    const cartNumber = document.getElementById("cart-count");
    let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
    
    if (cartNumber) {
        cartNumber.textContent = cartCount;
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            cartCount++;
            cartNumber.textContent = cartCount;
            localStorage.setItem("cartCount", cartCount);
        });
    });

    // ====== FIXED DROPDOWN MENU (WORKS ON ALL PAGES) ======
    const productsDropdownBtn = document.getElementById("products-dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (productsDropdownBtn && dropdownMenu) {
        productsDropdownBtn.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("active");
        });

        // Close dropdown if clicking outside
        document.addEventListener("click", function (event) {
            if (!productsDropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

    // ====== CATEGORY FILTERING (DYNAMICALLY WORKS) ======
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            window.location.href = `products.html?category=${category}`;
            dropdownMenu.classList.remove("active");
        });
    });

    // ====== MOBILE MENU TOGGLE ======
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove("active");
            }
        });
    }

    // ====== SEARCH FUNCTION ======
    const searchForm = document.getElementById("search-form");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let query = document.getElementById("search").value.toLowerCase();
            filterProductsBySearch(query);
        });
    }

    function filterProductsBySearch(query) {
        const allProducts = document.querySelectorAll(".product-item");

        allProducts.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(query) ? "block" : "none";
        });

        document.getElementById("category-title").textContent = `Search results for: "${query}"`;
    }
});

