window.getCategoryFromURL = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("category") || "all";
};
console.log("getCategoryFromURL function is now globally available!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded Successfully!");
    
    // ====== GLOBAL VARIABLES ======
    const cartNumber = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ====== UPDATE CART DISPLAY ======
    function updateCartDisplay() {
        if (cartNumber) {
            cartNumber.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // ====== ADD TO CART FUNCTION ======
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

    // ====== FILTER PRODUCTS BASED ON CATEGORY ======
    function normalizeCategory(category) {
        return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and").replace(/[^a-z0-9-]/g, "");
    }

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");
        if (!categoryTitle) return;

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
    }

    const category = getCategoryFromURL();
    filterProducts(category);

    // ====== HANDLE DROPDOWN NAVIGATION ======
    document.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];
            const mainCategory = this.closest(".dropdown").querySelector("a").textContent.toLowerCase();
            const targetPage = mainCategory.includes("furniture") ? "furniture.html" : "bdsm-gear.html";
            window.location.href = `${targetPage}?category=${category}`;
        });
    });

    // ====== DROPDOWN MENU BEHAVIOR (HOVER TO OPEN) ======
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            this.querySelector(".dropdown-menu").classList.add("active");
        });
        dropdown.addEventListener("mouseleave", function () {
            this.querySelector(".dropdown-menu").classList.remove("active");
        });
    });

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

        if (clearCartBtn) {
            clearCartBtn.addEventListener("click", function () {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        }

        renderCart(); // Ensure cart loads when page is opened
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const slideInterval = 10000; // 10 seconds

    // Initialize - Add 'active' class to first slide
    slides[currentSlide].classList.add('active');

    // Function to show the current slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    // Move to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Move to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto Slide Every 10 Seconds
    setInterval(nextSlide, slideInterval);

    // Button Controls
    document.querySelector(".prev").addEventListener("click", prevSlide);
    document.querySelector(".next").addEventListener("click", nextSlide);
});
