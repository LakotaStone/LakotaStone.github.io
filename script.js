document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded successfully!");

    // ====== CART POPUP FUNCTIONALITY ======
    const cartIcon = document.getElementById("cart-icon");
    const popupCart = document.getElementById("popup-cart");
    const closePopup = document.querySelector(".close-popup");

    if (cartIcon && popupCart) {
        cartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            popupCart.style.display = "block"; // Show the popup
        });
    }

    if (closePopup) {
        closePopup.addEventListener("click", function () {
            popupCart.style.display = "none"; // Hide popup when clicking close
        });
    }

    // Close popup when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === popupCart) {
            popupCart.style.display = "none";
        }
    });

    // ====== DROPDOWN MENU (CLICK TO OPEN & CLOSE) ======
    const dropdownBtn = document.getElementById("products-dropdown-btn");
    const dropdownMenu = document.getElementById("products-dropdown");

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.classList.toggle("active"); // Toggle visibility
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

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
