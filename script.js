document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ checking script!");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();

    function filterProducts(category) {
        document.querySelectorAll(".product-item").forEach(product => {
            if (category === "all" || product.classList.contains(category)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });

        document.getElementById("category-title").textContent =
            category.charAt(0).toUpperCase() + category.slice(1);
    }

    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    if (document.getElementById("category-title")) {
        filterProducts(getCategoryFromURL());
    }

    document.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let category = this.getAttribute("href").split("=")[1];
            window.location.href = `products.html?category=${category}`;
        });
    });

    const cartIcon = document.getElementById("cart-icon");
    const popupCart = document.getElementById("popup-cart");

    if (cartIcon && popupCart) {
        cartIcon.addEventListener("click", function (event) {
            event.preventDefault();
            popupCart.style.display = "block";
        });
    }

    const closePopup = document.querySelector(".close-popup");
    if (closePopup) {
        closePopup.addEventListener("click", function () {
            popupCart.style.display = "none";
        });
    }
});
