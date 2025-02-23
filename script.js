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

    // ====== FIX CATEGORY FILTERING IMMEDIATELY ======
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

        // Ensure right-side navigation stays visible
        document.querySelector(".right-side").style.display = "flex"; 

        allProducts.forEach(product => {
            if (normalizedCategory === "all" || product.classList.contains(normalizedCategory)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        // Fix category title to prevent unwanted flashing
        categoryTitle.textContent = found
            ? (normalizedCategory === "all" ? "All Furniture" : category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
            : `No products found for "${category}"`;

        console.log(`Filtered for category: ${normalizedCategory}`);
    }

    // ====== ENSURE CATEGORY FILTERING WORKS WITHOUT FLASHING ALL PRODUCTS ======
    const category = getCategoryFromURL();
    if (category) {
        filterProducts(category);
    }

    // ====== FIX DROPDOWN CLICK TO FILTER CORRECTLY ======
    document.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            if (window.location.pathname.includes("furniture.html")) {
                filterProducts(category);
            } else {
                window.location.href = `furniture.html?category=${category}`;
            }
        });
    });

    // ====== FIX DROPDOWN MENU HOVER ======
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
            ? `Search results for: "${query}"`
            : `No results found for "${query}"`;
    }
});
