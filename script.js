// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded successfully!");

    // ====== CART FUNCTIONALITY ======
    let cartCount = 0;  // Store cart count
    const cartNumber = document.getElementById("cart-count"); // Cart display
    const addToCartButtons = document.querySelectorAll(".add-to-cart"); // All "Add to Cart" buttons

    // Check if buttons exist before adding event listeners
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", () => {
                cartCount++;
                cartNumber.textContent = cartCount;
                console.log(`Added to cart! New count: ${cartCount}`);
            });
        });
    } else {
        console.warn("No 'Add to Cart' buttons found.");
    }

    // ====== SMOOTH SCROLLING FOR NAVIGATION ======
    const navLinks = document.querySelectorAll("nav ul li a");

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent default link behavior

                const targetId = link.getAttribute("href").substring(1); // Get target section ID
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 60, // Adjust for header height
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    // ====== MOBILE MENU TOGGLE ======
    const menuToggle = document.getElementById("menu-toggle"); // Menu button
    const navMenu = document.getElementById("nav-menu"); // Navigation menu

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    } else {
        console.warn("No menu elements found for mobile toggle.");
    }
});
