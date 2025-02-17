document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    const cartNumber = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartNumber.textContent = totalItems;
    }

    updateCartCount();

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const name = event.target.getAttribute("data-name");
            const price = parseFloat(event.target.getAttribute("data-price"));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        });
    });

    // ====== CART PAGE FUNCTIONALITY ======
    function loadCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        if (!cartItemsContainer || !cartTotal) return;

        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)} x 
                <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="cart-quantity"> 
                <button class="remove-item" data-index="${index}">Remove</button></p>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Update quantity event listener
        document.querySelectorAll(".cart-quantity").forEach(input => {
            input.addEventListener("change", (event) => {
                let index = event.target.getAttribute("data-index");
                cart[index].quantity = parseInt(event.target.value);
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            });
        });

        // Remove item event listener
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                let index = event.target.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
                updateCartCount();
            });
        });
    }

    loadCart();

    // Clear cart functionality
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            localStorage.removeItem("cart");
            cart = [];
            loadCart();
            updateCartCount();
        });
    }

    // ====== DROPDOWN MENU FUNCTIONALITY ======
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
