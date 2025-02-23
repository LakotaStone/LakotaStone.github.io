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
            }

            if (event.target.classList.contains("decrease-qty")) {
                let index = event.target.getAttribute("data-index");
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            }

            if (event.target.classList.contains("remove-item")) {
                let index = event.target.getAttribute("data-index");
                cart.splice(index, 1);
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

