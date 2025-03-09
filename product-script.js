document.addEventListener("DOMContentLoaded", function () {
    console.log("Product Script Loaded Successfully!");

    // ====== DROPDOWN MENU BEHAVIOR (HOVER TO OPEN) ======
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            this.querySelector(".dropdown-menu").classList.add("active");
        });
        dropdown.addEventListener("mouseleave", function () {
            this.querySelector(".dropdown-menu").classList.remove("active");
        });
    });

    // ====== IMAGE SWITCHER FOR PRODUCT PAGE ======
    function changeImage(src) {
        document.getElementById("main-image").src = src;
    }
    document.querySelectorAll(".thumbnails img").forEach(img => {
        img.addEventListener("click", function () {
            changeImage(this.src);
        });
    });

    // ====== QUANTITY SELECTOR LOGIC ======
    const quantityInput = document.getElementById("quantity");
    const incrementBtn = document.createElement("button");
    const decrementBtn = document.createElement("button");

    incrementBtn.textContent = "+";
    decrementBtn.textContent = "-";
    incrementBtn.classList.add("quantity-increase");
    decrementBtn.classList.add("quantity-decrease");

    quantityInput.parentNode.insertBefore(decrementBtn, quantityInput);
    quantityInput.parentNode.insertBefore(incrementBtn, quantityInput.nextSibling);

    incrementBtn.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    decrementBtn.addEventListener("click", () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });

    // ====== ADD TO CART FUNCTION ======
    const cartNumber = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        if (cartNumber) {
            cartNumber.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    const addToCartButton = document.querySelector(".add-to-cart");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {
            const name = addToCartButton.getAttribute("data-name");
            const price = parseFloat(addToCartButton.getAttribute("data-price"));
            const quantity = parseInt(quantityInput.value);

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
            alert(`Added ${quantity} item(s) of "${name}" to your cart.`);
        });
    }

    // Initial update of the cart count on page load
    updateCartDisplay();
});
