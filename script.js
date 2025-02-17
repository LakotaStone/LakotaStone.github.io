document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();

    function updateCart() {
        let cartItemsContainer = document.getElementById("cart-items");
        let popupCartItemsContainer = document.getElementById("popup-cart-items");
        let cartTotal = document.getElementById("cart-total");
        let popupCartTotal = document.getElementById("popup-cart-total");
        let cartCount = document.getElementById("cart-count");

        if (!cartItemsContainer || !popupCartItemsContainer) return; // Ensure cart elements exist

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

    // Open Popup Cart
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
        cartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("popup-cart").style.display = "block";
        });
    }

    // Close Popup Cart
    const closePopup = document.querySelector(".close-popup");
    if (closePopup) {
        closePopup.addEventListener("click", function () {
            document.getElementById("popup-cart").style.display = "none";
        });
    }

    // Clear Cart
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            localStorage.removeItem("cart");
            cart = [];
            updateCart();
        });
    }

    // Proceed to Checkout (Ensure Cart is Not Empty)
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (event) {
            if (cart.length === 0) {
                event.preventDefault();
                alert("Your cart is empty. Add items before checking out.");
            }
        });
    }

    // Load Cart Data on Checkout Page
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

    // Handle Checkout Form Submission
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

