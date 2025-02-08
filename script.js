document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
    const cartNumber = document.getElementById("cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    if (cartNumber) {
        cartNumber.textContent = cartCount;
    }

    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", () => {
                cartCount++;
                cartNumber.textContent = cartCount;
                localStorage.setItem("cartCount", cartCount);
                console.log(`Added to cart! New count: ${cartCount}`);
            });
        });
    } else {
        console.warn("No 'Add to Cart' buttons found.");
    }

    // ====== DROPDOWN MENU (Click to Open) ======
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

            // Update the URL without reloading the page
            window.history.pushState({}, "", `products.html?category=${category}`);

            // Filter products based on selected category
            filterProducts(category);
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
            if (category === "all" || product.classList.contains(category)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });

        // Update category title
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        categoryTitle.textContent = category === "all" ? "All Products" : `${formattedCategory}`;
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

    // ====== SEARCH FUNCTION ======
    const searchForm = document.getElementById("search-form");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let query = document.getElementById("search").value.toLowerCase();
            window.location.href = `products.html?search=${query}`;
        });
    }
});
