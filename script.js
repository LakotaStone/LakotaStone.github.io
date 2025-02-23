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

    // ====== FIX CATEGORY FILTERING ON PAGE LOAD ======
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    function normalizeCategory(category) {
        return category
            .toLowerCase()
            .replace(/_/g, "-")  // Replace underscores with dashes
            .replace(/\s+/g, "-") // Replace spaces with dashes
            .replace(/[^a-z0-9-]/g, ""); // Remove special characters
    }

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");

        if (!categoryTitle) return; // Prevent errors if not on a category page

        const normalizedCategory = normalizeCategory(category);
        let found = false;

        allProducts.forEach(product => {
            if (normalizedCategory === "all" || product.classList.contains(normalizedCategory)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        categoryTitle.textContent = found
            ? (normalizedCategory === "all" ? "All Furniture" : category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
            : No products found for "${category}";

        console.log(Filtered for category: ${normalizedCategory});
    }

    // ====== REMOVE DELAY & FILTER IMMEDIATELY ======
    const category = getCategoryFromURL();
    filterProducts(category);

    // ====== CATEGORY NAVIGATION WITHOUT RELOADING ======
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];
            window.location.href = furniture.html?category=${category};
        });
    });

    // ====== DROPDOWN MENU BEHAVIOR (Hover to Open) ======
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            this.querySelector(".dropdown-menu").classList.add("active");
        });

        dropdown.addEventListener("mouseleave", function () {
            this.querySelector(".dropdown-menu").classList.remove("active");
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

        document.getElementById("category-title").textContent = found
            ? Search results for: "${query}"
            : No results found for "${query}";
    }
});
