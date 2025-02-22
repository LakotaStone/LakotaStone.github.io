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

    // ====== DROPDOWN MENU (CLICK TO OPEN & CLOSE) ======
    const furnitureDropdownBtn = document.getElementById("furniture-dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (furnitureDropdownBtn && dropdownMenu) {
        furnitureDropdownBtn.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!furnitureDropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

    // ====== CATEGORY FILTERING ON PAGE LOAD ======
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");
        
        // Normalize category names to match class names
        const categoryMap = {
            "crosses": "crosses",
            "st-andrews-crosses": "crosses",
            "fetish-boxes": "fetish-boxes",
            "pillories": "pillories",
            "chairs": "chairs",
            "benches": "benches",
            "bedframes": "bedframes",
            "more": "more"
        };

        let normalizedCategory = categoryMap[category] || category;

        let found = false;
        allProducts.forEach(product => {
            if (normalizedCategory === "all" || product.classList.contains(normalizedCategory)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        categoryTitle.textContent = found ? (category === "all" ? "All Furniture" : category.replace("-", " ").charAt(0).toUpperCase() + category.slice(1)) : `No products found for "${category}"`;
    }

    if (document.body.contains(document.getElementById("category-title"))) {
        const category = getCategoryFromURL();
        filterProducts(category);
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
            document.getElementById("category-title").textContent = `No results found for "${query}"`;
        } else {
            document.getElementById("category-title").textContent = `Search results for: "${query}"`;
        }
    }
});


