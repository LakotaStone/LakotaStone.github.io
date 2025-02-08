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
            console.log(`Added to cart! New count: ${cartCount}`);
        });
    });

    // ====== DROPDOWN MENU (Click to Open & Close) ======
    const productsButton = document.querySelector("nav ul li a[href='products.html']");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (productsButton && dropdownMenu) {
        productsButton.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!productsButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

    // ====== FILTER PRODUCTS WITHOUT RELOADING ======
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            window.history.pushState({}, "", `products.html?category=${category}`);
            filterProducts(category);

            dropdownMenu.classList.remove("active"); // Close dropdown after clicking
        });
    });

    // ====== FILTER PRODUCTS ON PAGE LOAD ======
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "all";
    filterProducts(category);

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");

        allProducts.forEach(product => {
            product.style.display = product.classList.contains(category) || category === "all" ? "block" : "none";
        });

        categoryTitle.textContent = category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1);
    }

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

    // ====== SEARCH FUNCTION (Instant Filtering) ======
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

    // ====== VIEW PRODUCT FUNCTION (Future Individual Product Pages) ======
    document.querySelectorAll(".view-product").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.getAttribute("data-product");
            window.location.href = `product-details.html?product=${product}`;
        });
    });

});

