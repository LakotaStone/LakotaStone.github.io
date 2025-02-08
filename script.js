document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY (With Local Storage Persistence) ======
    let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
    const cartNumber = document.getElementById("cart-count"); // Cart count display
    const addToCartButtons = document.querySelectorAll(".add-to-cart"); // All "Add to Cart" buttons

    // Update cart display on page load
    if (cartNumber) {
        cartNumber.textContent = cartCount;
    }

    // Add to Cart Functionality
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", () => {
                cartCount++;
                cartNumber.textContent = cartCount;
                localStorage.setItem("cartCount", cartCount); // Save count in local storage
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
            event.preventDefault(); // Prevent link from navigating
            dropdownMenu.classList.toggle("active"); // Toggle dropdown visibility
        });

        // Close dropdown if user clicks anywhere outside
        document.addEventListener("click", function (event) {
            if (!productsButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("active");
            }
        });
    }

    // ====== MOBILE MENU TOGGLE ======
    const menuToggle = document.getElementById("menu-toggle"); // Mobile menu button
    const navMenu = document.getElementById("nav-menu"); // Navigation menu

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove("active");
            }
        });
    } else {
        console.warn("No menu elements found for mobile toggle.");
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
