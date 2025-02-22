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

    // ====== DROPDOWN MENU (HOVER TO OPEN) ======
    document.querySelectorAll(".dropdown").forEach(menu => {
        menu.addEventListener("mouseenter", () => {
            menu.querySelector(".dropdown-menu").style.display = "block";
        });
        menu.addEventListener("mouseleave", () => {
            menu.querySelector(".dropdown-menu").style.display = "none";
        });
    });

    // ====== CATEGORY FILTERING ON PAGE LOAD ======
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

        categoryTitle.textContent = found
            ? (category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1))
            : `No products found for "${category}"`;
    }

    if (document.body.contains(document.getElementById("category-title"))) {
        const category = getCategoryFromURL();
        filterProducts(category);
    }

    // ====== CATEGORY NAVIGATION WITHOUT RELOADING ======
    document.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];
            filterProducts(category);
            window.history.pushState({}, "", `?category=${category}`);
        });
    });

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
            document.getElementById("category-title").textContent = `No results found for "${query}"`;
        } else {
            document.getElementById("category-title").textContent = `Search results for: "${query}"`;
        }
    }
});
