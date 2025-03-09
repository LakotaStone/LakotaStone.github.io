// Switch main image when thumbnail is clicked
function changeImage(src) {
    document.getElementById('main-image').src = src;
}

// Quantity Selector Logic
const quantityInput = document.getElementById('quantity');
const incrementBtn = document.querySelector('.quantity-increase');
const decrementBtn = document.querySelector('.quantity-decrease');

// Increase Quantity
if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
}

// Decrease Quantity (minimum 1)
if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
}

// Simulated Add to Cart (expandable later)
const addToCartButton = document.querySelector('.add-to-cart');
if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
        const quantity = quantityInput.value;
        alert(`Added ${quantity} item(s) to your cart.`);
        // Integration with actual cart logic can be added here later
    });
}

