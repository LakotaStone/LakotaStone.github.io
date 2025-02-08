document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    const cartNumber = document.getElementById("cart-count");
    let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
    
    if (cartNumber) {
        cartNumber.textContent = cartCount;
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            cartCount++;
            cartNumber.textContent = cartCount;
            localStorage.setItem("cartCount", cartCount);
            console.log(`Added to cart! New count: ${cartCount}`);
        });
    });

    const dropdownMenu = document.querySelector(".dropdown-menu");
    const categoryLinks = document.querySelectorAll(".dropdown-menu a");

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.getAttribute("href").split("=")[1];

            window.history.pushState({}, "", `products.html?category=${category}`);
            filterProducts(category);

            dropdownMenu.classList.remove("active");
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "all";
    filterProducts(category);

    function filterProducts(category) {
        const allProducts = document.querySelectorAll(".product-item");
        const categoryTitle = document.getElementById("category-title");

        allProducts.forEach(product => {
            product.style.display = product.classList.contains(category) || category === "all" ? "block" : "none";
        });

        categoryTitle.textContent = category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1);
    }

    document.getElementById("menu-toggle").addEventListener("click", function () {
        document.getElementById("nav-menu").classList.toggle("active");
    });

    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        let query = document.getElementById("search").value.toLowerCase();
        filterProductsBySearch(query);
    });

    function filterProductsBySearch(query) {
        const allProducts = document.querySelectorAll(".product-item");

        allProducts.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(query) ? "block" : "none";
        });

        document.getElementById("category-title").textContent = `Search results for: "${query}"`;
    }
});
