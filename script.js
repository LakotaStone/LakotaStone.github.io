// Initialize cart from localStorage or as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update the cart icon display in the nav (number of items)
function updateCartDisplay() {
  const cartNumberElem = document.getElementById("cart-number");
  if (cartNumberElem) {
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartNumberElem.textContent = totalCount;
  }
}

// Highlight the current category in nav and ensure its dropdown is open
function updateNavigation() {
  const navMenu = document.getElementById("nav-menu");
  if (!navMenu) return;
  // Reset any existing active/open states
  document.querySelectorAll("#nav-menu a").forEach(a => a.classList.remove("active"));
  document.querySelectorAll(".dropdown.open").forEach(li => li.classList.remove("open"));
  // Determine current main category from body data attribute (if on a category page)
  const mainCatName = document.body.dataset.mainCategory;
  if (mainCatName) {
    const catId = mainCatName.toLowerCase().replace(/\s+/g, '-');  // e.g. "BDSM Gear" -> "bdsm-gear"
    const dropdownBtn = document.getElementById(catId + "-dropdown-btn");
    if (dropdownBtn) {
      dropdownBtn.classList.add("active");
      // Open the dropdown menu for the current category
      const parentLi = dropdownBtn.parentElement;
      if (parentLi && parentLi.classList.contains("dropdown")) {
        parentLi.classList.add("open");
      }
    }
  }
}

// Read the "category" parameter from URL (for filtering)
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("category") || "all";
}

// Normalize category string to match class names (lowercase, dashes)
function normalizeCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Filter product items on the page by category
function filterProducts(category) {
  const categoryTitle = document.getElementById("category-title");
  if (!categoryTitle) return;  // not on a category page
  const allProducts = document.querySelectorAll(".product-item");
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
  // Update the category title based on filter results
  if (normalizedCategory === "all") {
    // If showing all, show "All [CategoryName]"
    const mainCatName = document.body.dataset.mainCategory || "Products";
    categoryTitle.textContent = `All ${mainCatName}`;
  } else if (found) {
    // Show the filtered category name (formatted nicely)
    let displayName = category.replace(/-/g, ' ');
    displayName = displayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    categoryTitle.textContent = displayName;
  } else {
    // No products found for that filter
    categoryTitle.textContent = `No products found for "${category}"`;
  }
  console.log(`Filtered for category: ${normalizedCategory}`);
}

// Filter product items by search query (within the current category page)
function filterProductsBySearch(query) {
  const categoryTitle = document.getElementById("category-title");
  const allProducts = document.querySelectorAll(".product-item");
  if (!categoryTitle || !allProducts) return;
  query = query.trim().toLowerCase();
  let found = false;
  allProducts.forEach(product => {
    const productName = product.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(query)) {
      product.style.display = "block";
      found = true;
    } else {
      product.style.display = "none";
    }
  });
  if (query === "") {
    // If search query is empty, restore the original category filter
    const currentCategory = getCategoryFromURL();
    filterProducts(currentCategory);
    return;
  }
  // Update the title to indicate search results
  categoryTitle.textContent = found
    ? `Search results for: ${query}`
    : `No products found for "${query}"`;
}

// Setup event listeners for dropdown toggle (for mobile or click)
document.querySelectorAll(".dropdown > a").forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    // If the main category link is just a toggle (href="#"), toggle the menu
    if (anchor.getAttribute("href") === "#") {
      e.preventDefault();
      // Close any other open dropdown
      document.querySelectorAll(".dropdown.open").forEach(li => {
        if (li !== anchor.parentElement) li.classList.remove("open");
      });
      // Toggle this dropdown
      anchor.parentElement.classList.toggle("open");
    }
  });
});

// Setup event listeners for "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", (event) => {
    const name = event.target.getAttribute("data-name");
    const price = parseFloat(event.target.getAttribute("data-price"));
    // Check if item already in cart
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: name, price: price, quantity: 1 });
    }
    // Save cart to localStorage and update cart display
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  });
});

// Setup search form submission event (to filter by product name)
const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("search").value;
    filterProductsBySearch(query);
  });
}

// Cart page functionality: render cart items, handle quantity changes and clearing
if (document.getElementById("cart-items")) {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalElem.textContent = "Total: $0";
      updateCartDisplay();
      return;
    }
    // Render each item in cart
    cart.forEach((item, index) => {
      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <span>${item.name} x ${item.quantity}</span>
          <span>$${itemTotal.toFixed(2)}</span>
          <button class="decrease-qty" data-index="${index}">-</button>
          <button class="increase-qty" data-index="${index}">+</button>
          <button class="remove-item" data-index="${index}">Remove</button>
        </div>
      `;
    });
    cartTotalElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
    updateCartDisplay();
  }

  // Handle click events on cart items (increase, decrease, remove)
  cartItemsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("increase-qty")) {
      const idx = target.getAttribute("data-index");
      cart[idx].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
    if (target.classList.contains("decrease-qty")) {
      const idx = target.getAttribute("data-index");
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
      } else {
        // Remove item if quantity would go below 1
        cart.splice(idx, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
    if (target.classList.contains("remove-item")) {
      const idx = target.getAttribute("data-index");
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  // Clear cart button
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });

  // Initial render of cart on page load
  renderCart();
}

// On page load (for all pages), update navigation state and cart display, and apply any filtering
updateCartDisplay();
updateNavigation();
// If on a category page, apply the filter from URL (to persist subcategory filter when coming back)
const currentCategoryParam = getCategoryFromURL();
if (currentCategoryParam) {
  filterProducts(currentCategoryParam);
}
