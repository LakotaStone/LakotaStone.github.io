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

    // ====== ADD TO CART FUNCTION (MATCHES MAIN SCRIPT LOGIC) ======
    const cartNumber = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        if (cartNumber) {
            cartNumber.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    document.querySelector(".add-to-cart").addEventListener("click", function () {
        const name = document.querySelector(".product-details h1").textContent;
        const price = parseFloat(document.querySelector(".price").textContent.replace("$", ""));
        const quantity = parseInt(quantityInput.value);

        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        alert(`Added ${quantity} item(s) to your cart.`);
    });

    updateCartDisplay();
});
