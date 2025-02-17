document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();

    // ====== ADD TO CART FUNCTION ======
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            const image = this.getAttribute("data-image"); // Ensure products have data-image

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });
    });

    function updateCart() {
        let cartItemsContainer = document.getElementById("cart-items");
        let popupCartItemsContainer = document.getElementById("popup-cart-items");
        let cartTotal = document.getElementById("cart-total");
        let popupCartTotal = document.getElementById("popup-cart-total");
        let cartCount = document.getElementById("cart-count");

        if (!cartItemsContainer || !popupCartItemsContainer) return;

        cartItemsContainer.innerHTML = "";
        popupCartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            let cartItem = `
                <div class="cart-item">
                    <img src="images/${item.image}" alt="${item.name}" class="cart-image">
                    <p>${item.name} - $${item.price} x 
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="cart-quantity">
                    <button class="remove-item" data-index="${index}">Remove</button></p>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
            popupCartItemsContainer.innerHTML += cartItem;
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        popupCartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartCount.textContent = cart.length;

        document.querySelectorAll(".cart-quantity").forEach(input => {
            input.addEventListener("change", updateQuantity);
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", removeFromCart);
        });
    }

    function updateQuantity(event) {
        let index = event.target.getAttribute("data-index");
        cart[index].quantity = parseInt(event.target.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    function removeFromCart(event) {
        let index = event.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    // ====== POPUP CART FUNCTIONALITY ======
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
        cartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("popup-cart").style.display = "block";
        });
    }

    const closePopup = document.querySelector(".close-popup");
    if (closePopup) {
        closePopup.addEventListener("click", function () {
            document.getElementById("popup-cart").style.display = "none";
        });
    }

    // ====== CLEAR CART FUNCTION ======
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            localStorage.removeItem("cart");
            cart = [];
            updateCart();
        });
    }

    // ====== CHECKOUT FUNCTION ======
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (event) {
            if (cart.length === 0) {
                event.preventDefault();
                alert("Your cart is empty. Add items before checking out.");
            }
        });
    }

    if (document.getElementById("checkout-form")) {
        displayCheckoutCart();
    }

    function displayCheckoutCart() {
        let checkoutCartContainer = document.getElementById("checkout-cart-items");
        let checkoutCartTotal = document.getElementById("checkout-cart-total");

        checkoutCartContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item) => {
            let checkoutItem = `
                <div class="checkout-item">
                    <img src="images/${item.image}" alt="${item.name}" class="checkout-image">
                    <p>${item.name} - $${item.price} x ${item.quantity}</p>
                </div>
            `;
            checkoutCartContainer.innerHTML += checkoutItem;
            total += item.price * item.quantity;
        });

        checkoutCartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    // ====== HANDLE CHECKOUT FORM SUBMISSION ======
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        });
    }
});
