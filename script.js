document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    const cartNumber = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        if (cartNumber) {
            cartNumber.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const name = event.target.getAttribute("data-name");
            const price = parseFloat(event.target.getAttribute("data-price"));

            let existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        });
    });

    updateCartDisplay();

    // ====== FIX CATEGORY FILTERING ON PAGE LOAD ======
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

   function normalizeCategory(category) {
    return category
        .toLowerCase()
        .replace(/_/g, "-")  // Keep dashes
        .replace(/\s+/g, "-") // Keep spaces as dashes
        .replace(/&/g, "and") // Convert "&" to "and"
        .replace(/[^a-z0-9-]/g, ""); // Remove other special characters
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
            ? (normalizedCategory === "all" ? "All Products" : category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
            : `No products found for "${category}"`;

        console.log(`Filtered for category: ${normalizedCategory}`);
    }

    // ====== REMOVE DELAY & FILTER IMMEDIATELY ======
    const category = getCategoryFromURL();
    filterProducts(category);

    // ====== NAVIGATION UPDATE ======
    function updateNavigation() {
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;

    // Ensure both Furniture & BDSM Gear remain visible on all pages
    document.getElementById("furniture-dropdown-btn").parentElement.style.display = "block";
    document.getElementById("bdsm-gear-dropdown-btn").parentElement.style.display = "block";
}

    // ====== CATEGORY NAVIGATION WITHOUT RELOADING ======
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            if (window.location.pathname.includes("bdsm-gear.html")) {
                window.location.href = `bdsm-gear.html?category=${category}`;
            } else {
                window.location.href = `furniture.html?category=${category}`;
            }
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
            ? `Search results for: "${query}"`
            : `No results found for "${query}"`;
    }

    // ====== CART PAGE FUNCTIONALITY ======
    if (document.getElementById("cart-items")) {
        const cartItemsContainer = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const clearCartBtn = document.getElementById("clear-cart");

        function renderCart() {
            cartItemsContainer.innerHTML = "";
            let totalPrice = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
                cartTotal.textContent = "Total: $0";
                cartNumber.textContent = "0";
                return;
            }

            cart.forEach((item, index) => {
                let itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <img src="images/placeholder.jpg" alt="${item.name}" class="cart-item-image">
                    <p>${item.name} - $${item.price}</p>
                    <div class="cart-controls">
                        <button class="decrease-qty" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty" data-index="${index}">+</button>
                    </div>
                    <p class="item-total">Total: $${itemTotal.toFixed(2)}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
            updateCartDisplay();
        }

        cartItemsContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("increase-qty")) {
                let index = event.target.getAttribute("data-index");
                cart[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            } else if (event.target.classList.contains("decrease-qty")) {
                let index = event.target.getAttribute("data-index");
                if (cart[index].quantity > 1) cart[index].quantity--;
                else cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            }
        });

        clearCartBtn.addEventListener("click", function () {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });

        renderCart();
    }
});
