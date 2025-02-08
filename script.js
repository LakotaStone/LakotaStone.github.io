document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    function updateCartCount() {
        document.getElementById("cart-count").textContent = cart.length;
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));

            cart.push({ name, price });
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        });
    });

    // ====== DROPDOWN MENU (CLICK TO OPEN & CLOSE) ======
    const productsDropdownBtn = document.getElementById("products-dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (productsDropdownBtn && dropdownMenu) {
        productsDropdownBtn.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!productsDropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

    // ====== FIX CATEGORY FILTERING ON PAGE LOAD ======
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");
        let found = false;

        allProducts.forEach(product => {
            if (category === "all" || product.classList.contains(category)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (!found) {
            categoryTitle.textContent = `No products found for "${category}"`;
        } else {
            categoryTitle.textContent = category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1);
        }
    }

    // Get category from URL and filter products accordingly
    if (document.body.contains(document.getElementById("category-title"))) {
        const category = getCategoryFromURL();
        filterProducts(category);
    }

    // ====== CATEGORY NAVIGATION WITHOUT RELOADING ======
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            window.location.href = `products.html?category=${category}`;
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
        let found = false;

        allProducts.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            if (productName.includes(query)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (!found) {
            document.getElementById("category-title").textContent = `No results for "${query}"`;
        } else {
            document.getElementById("category-title").textContent = `Search results for "${query}"`;
        }
    }

    // ====== VIEW PRODUCT FUNCTIONALITY (FOR FUTURE INDIVIDUAL PRODUCT PAGES) ======
    document.querySelectorAll(".view-product").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.getAttribute("data-product");
            window.location.href = `product-details.html?product=${product}`;
        });
    });
});

