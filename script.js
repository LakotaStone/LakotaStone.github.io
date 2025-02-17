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

    // ====== CATEGORY FILTERING ON PAGE LOAD ======
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

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

        categoryTitle.textContent = category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (document.body.contains(document.getElementById("category-title"))) {
        const category = getCategoryFromURL();
        filterProducts(category);
    }

    // ====== SEARCH FUNCTION (FIXED) ======
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
