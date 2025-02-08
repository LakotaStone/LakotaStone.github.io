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

    // ====== ENSURE PAGE SCROLLS TO THE TOP ON NAVIGATION ======
    const navLinks = document.querySelectorAll(".dropdown-menu a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("#")[1];

            // Redirect to products page with category parameter
            window.location.href = `products.html?category=${category}`;
        });
    });

    // ====== FILTER PRODUCTS BY CATEGORY ======
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category) {
        filterProducts(category);
    }

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");

        allProducts.forEach(product => {
            if (category === "all" || product.classList.contains(category)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });

        // Ensure page scrolls to the top
        window.scrollTo(0, 0);
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
