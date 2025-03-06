document.addEventListener('DOMContentLoaded', function() {
    // Identify all product items on the page.
    // Each product item should have data attributes: data-main (main category) and data-sub (subcategory).
    const products = document.querySelectorAll('[data-main][data-sub]');
    if (products.length === 0) {
        // No products found – likely not a category listing page. Exit to avoid affecting other pages (e.g., product detail or cart page).
        return;
    }

    // Build a map of main categories to their subcategories (excluding the "More" pseudo-category).
    const categorySubMap = {};
    const mainCategoryLinks = document.querySelectorAll('.main-cat > a[data-main]');
    mainCategoryLinks.forEach(link => {
        const mainCatKey = link.getAttribute('data-main');
        // Ensure a list exists for this main category in the map
        categorySubMap[mainCatKey] = categorySubMap[mainCatKey] || [];
        // Find all subcategory links under this main category (assumes HTML structure nests subcategory <a> inside parent .main-cat <li>)
        const subLinks = link.parentElement.querySelectorAll('ul.sub-cat-list a[data-sub]');
        subLinks.forEach(sublink => {
            const subName = sublink.getAttribute('data-sub');
            if (subName && subName.toLowerCase() !== 'more') {
                // Add this subcategory to the map for its main category (avoiding "More")
                categorySubMap[mainCatKey].push(subName);
            }
        });
    });

    /**
     * Filters the product list based on selected main category and subcategory.
     * @param {string} mainCat - The key of the main category to filter by (e.g., "furniture" or "bdsm-gear").
     * @param {string|null} subCat - The subcategory to filter by. If null or "all", all products under the main category will be shown. 
     *                               If subCat is "more", shows products under mainCat that are not in any other subcategory.
     */
    function filterProducts(mainCat, subCat) {
        products.forEach(product => {
            const productMain = product.getAttribute('data-main');
            const productSub = product.getAttribute('data-sub');
            let show = true;
            // Filter by main category
            if (!mainCat || productMain !== mainCat) {
                show = false;
            }
            // Further filter by subcategory if applicable
            if (show && subCat && subCat.toLowerCase() !== 'all') {
                if (subCat.toLowerCase() === 'more') {
                    // "More": show product only if its subcategory is not listed in the known subcategories for this main category.
                    // (This includes items with no subcategory or a subcategory that is not explicitly in the nav list.)
                    const knownSubs = categorySubMap[mainCat] || [];
                    if (productSub && knownSubs.includes(productSub)) {
                        show = false;
                    }
                } else {
                    // Regular subcategory: show product only if its subcategory matches the selected subCat.
                    if (productSub !== subCat) {
                        show = false;
                    }
                }
            }
            // Apply the display based on the filter outcome
            if (show) {
                product.style.display = "";    // show (using default display, which could be block/grid as per CSS)
            } else {
                product.style.display = "none"; // hide
            }
        });
    }

    /**
     * Updates the navigation UI to reflect the active category and subcategory.
     * - Highlights the active main category and subcategory.
     * - Ensures all main categories remain visible (does not hide any).
     * - Opens the subcategory dropdown for the active main category (if applicable).
     * @param {string} mainCat - The main category key to mark as active.
     * @param {string|null} subCat - The subcategory to mark as active (if any).
     */
    function setActiveNav(mainCat, subCat) {
        // Remove active classes from all main and subcategory links to reset previous state
        mainCategoryLinks.forEach(link => link.classList.remove('active'));
        const allSubLinks = document.querySelectorAll('ul.sub-cat-list a[data-sub]');
        allSubLinks.forEach(sublink => sublink.classList.remove('active'));

        // Highlight the selected main category link
        const activeMainLink = document.querySelector(`.main-cat > a[data-main="${mainCat}"]`);
        if (activeMainLink) {
            activeMainLink.classList.add('active');
        }
        // If the navigation HTML uses an active class on the <li> element for an open dropdown, handle that:
        const mainListItem = activeMainLink ? activeMainLink.parentElement : null;
        if (mainListItem) {
            // Remove active class from all main category list items first
            document.querySelectorAll('.main-cat').forEach(li => li.classList.remove('active'));
            // Add active class to the current main category list item to mark it (this could be used by CSS to show its subcategory dropdown)
            mainListItem.classList.add('active');
        }

        // Highlight the selected subcategory link, if one is chosen
        if (subCat) {
            const activeSubLink = document.querySelector(`ul.sub-cat-list a[data-sub="${subCat}"][data-main="${mainCat}"]`);
            if (activeSubLink) {
                activeSubLink.classList.add('active');
            }
        }
        // Note: We ensure that main categories are never hidden. The HTML/CSS should be set up such that 
        // all .main-cat elements (and their links) are always displayed in the nav.
        // This function only toggles 'active' classes for styling purposes (e.g., highlighting and dropdown visibility).
    }

    /**
     * Apply a given category filter and update UI & state accordingly.
     * @param {string} mainCat - The main category to filter by.
     * @param {string|null} subCat - The subcategory to filter by (null or "all" for no specific subcategory).
     */
    function applyCategoryFilter(mainCat, subCat) {
        // Normalize parameters (null or "all" means show all in main category)
        if (!subCat || subCat.toLowerCase() === 'all') {
            subCat = null;
        }
        // Perform the filtering of products
        filterProducts(mainCat, subCat);
        // Update navigation highlighting
        setActiveNav(mainCat, subCat);
        // Persist the selected subcategory for this main category in localStorage (for page persistence on return/back navigation)
        const storageKey = "selectedSub_" + mainCat;
        if (subCat) {
            // Store the subcategory selection
            localStorage.setItem(storageKey, subCat);
        } else {
            // No subcategory (i.e., viewing all in main category) => remove any stored selection
            localStorage.removeItem(storageKey);
        }
    }

    // Determine the current main category context.
    // We can use the first product's data-main attribute as the current category (assuming this script runs on a single category page).
    let currentMain = null;
    if (products.length > 0) {
        currentMain = products[0].getAttribute('data-main');
    }
    // Alternatively, if the nav has an indicator of the current main category (e.g., server-side rendered active class),
    // we could derive currentMain from that. For generality, using the product data as above.

    // If for some reason multiple main categories' products are present (which shouldn't happen on a well-structured category page),
    // we could refine currentMain by majority or by context. Here, we assume one main category per page.

    // Retrieve any persisted subcategory selection for this main category from localStorage.
    let initialSub = null;
    if (currentMain) {
        const storedSub = localStorage.getItem("selectedSub_" + currentMain);
        if (storedSub) {
            initialSub = storedSub;
        }
    }

    // Initial page load: apply filter based on current main category and any persisted subcategory.
    // If no subcategory was stored, this will just show all products of the current main category (which is likely the default state).
    if (currentMain) {
        applyCategoryFilter(currentMain, initialSub);
    }

    // Event listeners for subcategory links:
    const subCategoryLinks = document.querySelectorAll('ul.sub-cat-list a[data-sub]');
    subCategoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // prevent default link navigation (if href is "#" or some link, we handle filtering via JS)
            const mainCat = link.getAttribute('data-main');
            const subCat = link.getAttribute('data-sub');
            if (!mainCat) {
                // If data-main is not set on subcategory links, infer it from the DOM (parent <li> structure).
                // It's recommended to have data-main on each subcategory link for clarity.
                const parentMainItem = link.closest('.main-cat');
                if (parentMainItem && parentMainItem.querySelector('a[data-main]')) {
                    mainCat = parentMainItem.querySelector('a[data-main]').getAttribute('data-main');
                }
            }
            if (!mainCat) {
                return; // Unable to determine main category, abort.
            }
            // When a subcategory is clicked, apply the corresponding filter
            applyCategoryFilter(mainCat, subCat);
        });
    });

    // Event listeners for main category links (to ensure all main categories remain visible and handle persistence logic).
    mainCategoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const mainCat = link.getAttribute('data-main');
            if (!mainCat) return;
            // If the main category link is intended to be a simple filter (and not a page navigation),
            // you might prevent default and handle like showing all in that category:
            // event.preventDefault();
            // applyCategoryFilter(mainCat, null);
            // (However, if main category links navigate to separate pages, do not prevent default. 
            // The persistence for subcategory is handled below.)
            
            // Remove any stored subcategory selection for this main category when the main category link is explicitly clicked.
            // This ensures that if the user is intentionally navigating to the main category (to see all items),
            // we don't persist an old subcategory filter.
            localStorage.removeItem("selectedSub_" + mainCat);
            // Note: We do not call applyCategoryFilter here because clicking a main category link likely navigates to that category's page.
            // The filtering on the new page (showing all items in that category) will be handled on page load by the script (with no sub filter since we removed it).
        });
    });

});
