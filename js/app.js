// ===== E-COMMERCE UPGRADE UTILITIES & FEATURES =====

// 1. Mock Product Database (to power search, filter, and operations)
const PRODUCTS_DB = [
  { id: '1', name: 'Men casual t-shirt cotton', price: 10.30, category: 'Clothing', image: 'Images/casual shirts.png', rating: 4.0, origin: 'USA' },
  { id: '2', name: 'Outdoor jacket windproof', price: 39.90, category: 'Clothing', image: 'Images/jacket.png', rating: 5.0, origin: 'Germany' },
  { id: '3', name: 'Classic slim fit suit', price: 79.96, category: 'Clothing', image: 'Images/slim fit suit (1).jpg', rating: 4.5, origin: 'China' },
  { id: '4', name: 'Slim denim jeans blue', price: 84.00, category: 'Clothing', image: 'Images/jeans.png', rating: 4.0, origin: 'Korea' },
  { id: '5', name: 'Travel backpack 35L', price: 32.00, category: 'Accessories', image: 'Images/bag.png', rating: 4.5, origin: 'Germany' },
  { id: '6', name: 'Fashion handbag leather', price: 79.00, category: 'Accessories', image: 'Images/bag.png', rating: 5.0, origin: 'Italy' },
  { id: '7', name: 'Wireless headphones BT', price: 22.10, category: 'Electronics', image: 'Images/headphone.png', rating: 4.0, origin: 'Japan' },
  { id: '8', name: 'Smart watch sport GPS', price: 19.30, category: 'Electronics', image: 'Images/watch.png', rating: 4.5, origin: 'USA' },
  { id: '9', name: 'Ceramic water pitcher', price: 29.00, category: 'Accessories', image: 'Images/ceramic shirt.png', rating: 4.0, origin: 'France' },
  { id: '10', name: 'Coffee maker machine', price: 40.00, category: 'Electronics', image: 'Images/kitchen.png', rating: 4.5, origin: 'Italy' },
  { id: '11', name: 'Stylish sunglasses UV', price: 67.00, category: 'Accessories', image: 'Images/sunglasses.jpg', rating: 4.0, origin: 'Spain' },
  { id: '12', name: 'Leather shoulder bag', price: 60.40, category: 'Accessories', image: 'Images/bag.png', rating: 4.5, origin: 'Italy' },
  { id: '13', name: 'smart phone EOS 250D, Black 18x zoom', price: 998.00, category: 'Electronics', image: 'Images/phone.png', rating: 4.0, origin: 'Japan' },
  { id: '14', name: 'GoPro HERO6 basic version Action Camera - Black', price: 998.00, category: 'Electronics', image: 'Images/camera.png', rating: 4.0, origin: 'USA' },
  { id: '15', name: 'GoPro HERO6 2K Action Camera - Blue', price: 998.00, category: 'Electronics', image: 'Images/camera.png', rating: 4.0, origin: 'Japan' },
  { id: '16', name: 'GoPro HERO6 4K Action Camera - Black', price: 998.00, category: 'Electronics', image: 'Images/camera.png', rating: 4.0, origin: 'Germany' },
  { id: '17', name: 'Smart watch MI version 6 - White', price: 998.00, category: 'Electronics', image: 'Images/watch.png', rating: 4.0, origin: 'China' },
  { id: '18', name: 'version 6 headphones - blue-Black', price: 998.00, category: 'Electronics', image: 'Images/headphone.png', rating: 4.0, origin: 'Japan' }
];

// 2. Storage Utility Helpers
const CartStorage = {
  get() {
    const data = localStorage.getItem('cart_items');
    return data ? JSON.parse(data) : [
      { id: '13', qty: 1, size: 'medium', color: 'black' },
      { id: '14', qty: 2, size: 'default', color: 'default' },
      { id: '17', qty: 1, size: 'default', color: 'white' }
    ];
  },
  save(items) {
    localStorage.setItem('cart_items', JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdated'));
  },
  add(id, qty = 1, size = 'default', color = 'default') {
    const items = this.get();
    const existing = items.find(item => item.id === String(id) && item.size === size && item.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: String(id), qty, size, color });
    }
    this.save(items);
    showToast('Added to cart ✓', 'success');
  },
  remove(id, size = 'default', color = 'default') {
    let items = this.get();
    items = items.filter(item => !(item.id === String(id) && item.size === size && item.color === color));
    this.save(items);
    showToast('Removed from cart', 'info');
  },
  updateQty(id, qty, size = 'default', color = 'default') {
    const items = this.get();
    const target = items.find(item => item.id === String(id) && item.size === size && item.color === color);
    if (target) {
      target.qty = parseInt(qty);
      if (target.qty <= 0) {
        this.remove(id, size, color);
      } else {
        this.save(items);
      }
    }
  },
  clear() {
    this.save([]);
    showToast('Cart cleared', 'info');
  }
};

const WishlistStorage = {
  get() {
    const data = localStorage.getItem('wishlist_items');
    return data ? JSON.parse(data) : [];
  },
  save(items) {
    localStorage.setItem('wishlist_items', JSON.stringify(items));
    window.dispatchEvent(new Event('wishlistUpdated'));
  },
  toggle(id) {
    const items = this.get();
    const index = items.indexOf(String(id));
    let added = false;
    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.push(String(id));
      added = true;
    }
    this.save(items);
    showToast(added ? 'Saved to wishlist ♥' : 'Removed from wishlist', added ? 'success' : 'info');
    return added;
  }
};

const RecentViewStorage = {
  get() {
    const data = localStorage.getItem('recent_views');
    return data ? JSON.parse(data) : [];
  },
  add(id) {
    let items = this.get();
    items = items.filter(item => item !== String(id));
    items.unshift(String(id));
    if (items.length > 5) items.pop();
    localStorage.setItem('recent_views', JSON.stringify(items));
  }
};

// 3. Toast Notifications System
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger reflow & show
  setTimeout(() => toast.classList.add('show'), 50);

  // Dismiss after 2.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// 4. Star Rating Utility
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// 5. Add to Cart Fly Animation
function triggerFlyAnimation(element, targetSelector = '.header-icons span:last-child') {
  if (!element) return;
  const target = document.querySelector(targetSelector) || document.querySelector('.nav-icons .nav-icon:last-child');
  if (!target) return;

  const rect = element.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const flyImg = document.createElement('img');
  flyImg.src = element.src || 'Images/phone.png';
  flyImg.className = 'flying-img';
  flyImg.style.top = `${rect.top}px`;
  flyImg.style.left = `${rect.left}px`;
  document.body.appendChild(flyImg);

  // Animate path
  setTimeout(() => {
    flyImg.style.top = `${targetRect.top + 5}px`;
    flyImg.style.left = `${targetRect.left + 5}px`;
    flyImg.style.width = '10px';
    flyImg.style.height = '10px';
    flyImg.style.opacity = '0.3';
  }, 50);

  setTimeout(() => {
    flyImg.remove();
    // Bump badge
    const badge = target.querySelector('.cart-badge') || target.querySelector('.wishlist-badge');
    if (badge) {
      badge.classList.add('badge-bump');
      setTimeout(() => badge.classList.remove('badge-bump'), 300);
    }
  }, 850);
}

// 6. Global DOMContentLoaded Setup
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initStickyHeader();
  initHamburgerMenu();
  initAutocompleteSearch();
  initScrollReveal();
  initBackToTop();
  updateHeaderBadges();

  // Listen to updates
  window.addEventListener('cartUpdated', updateHeaderBadges);
  window.addEventListener('wishlistUpdated', updateHeaderBadges);

  // Load page specific features
  const path = window.location.pathname;
  if (path.includes('homepage.html') || path.endsWith('/') || path.split('/').pop() === '') {
    initHomepageFeatures();
  } else if (path.includes('products.html')) {
    initProductListFeatures();
  } else if (path.includes('productdetails.html')) {
    initProductDetailsFeatures();
  } else if (path.includes('cart.html')) {
    initCartPageFeatures();
  }
});

// Update Cart/Wishlist Badge Counts in headers
function updateHeaderBadges() {
  // Cart count
  const cart = CartStorage.get();
  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Find Cart Icon Span (last icon usually in header-icons or header span)
  const headerCartSpan = document.querySelector('.header-icons span[onclick*="cart.html"]') || 
                           document.querySelector('.nav-icons .nav-icon:nth-child(4)') ||
                           document.querySelector('.header-icons span:last-child');
  
  if (headerCartSpan) {
    let badge = headerCartSpan.querySelector('.cart-badge');
    if (!badge && totalCartQty > 0) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      headerCartSpan.appendChild(badge);
    }
    if (badge) {
      badge.textContent = totalCartQty;
      badge.style.display = totalCartQty > 0 ? 'inline-block' : 'none';
    }
  }

  // Wishlist count
  const wishlist = WishlistStorage.get();
  const totalWishlistQty = wishlist.length;

  const headerWishlistSpan = document.querySelector('.header-icons span[onclick*="wishlist"]') ||
                               document.querySelector('.nav-icons .nav-icon:nth-child(3)');
  
  if (headerWishlistSpan) {
    let badge = headerWishlistSpan.querySelector('.wishlist-badge');
    if (!badge && totalWishlistQty > 0) {
      badge = document.createElement('span');
      badge.className = 'wishlist-badge';
      headerWishlistSpan.appendChild(badge);
    }
    if (badge) {
      badge.textContent = totalWishlistQty;
      badge.style.display = totalWishlistQty > 0 ? 'inline-block' : 'none';
    }
  }
}

// 7. Dark Mode Integration (Feature 15)
function initDarkMode() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Inject sun/moon toggle in header
  const headerIcons = document.querySelector('.header-icons') || document.querySelector('.nav-icons');
  if (headerIcons) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.title = 'Toggle Dark/Light Mode';
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    headerIcons.insertBefore(toggleBtn, headerIcons.firstChild);

    toggleBtn.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      showToast(`${theme === 'dark' ? 'Dark' : 'Light'} Mode Enabled`, 'info');
    });
  }
}

// 8. Sticky Header (Feature 18)
function initStickyHeader() {
  const header = document.querySelector('header') || document.querySelector('.top-header');
  if (!header) return;

  const originalOffset = header.offsetTop;

  window.addEventListener('scroll', () => {
    if (window.scrollY > originalOffset + 50) {
      header.classList.add('sticky');
      document.body.classList.add('has-sticky-header');
      if (window.scrollY > originalOffset + 150) {
        header.classList.add('shrunk');
      } else {
        header.classList.remove('shrunk');
      }
    } else {
      header.classList.remove('sticky', 'shrunk');
      document.body.classList.remove('has-sticky-header');
    }
  });
}

// 9. Hamburger Responsive Navigation (Feature 16)
function initHamburgerMenu() {
  const navBar = document.querySelector('.nav-bar');
  if (!navBar) return;

  // Create hamburger button
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'hamburger-menu-btn';
  hamburgerBtn.title = 'Open Menu';
  hamburgerBtn.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;
  navBar.insertBefore(hamburgerBtn, navBar.firstChild);

  // Create Side Drawer
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.innerHTML = `
    <div class="nav-drawer-header">
      <h3>Categories & Navigation</h3>
      <button class="nav-drawer-close">&times;</button>
    </div>
    <div class="nav-drawer-links"></div>
  `;
  document.body.appendChild(drawer);

  // Copy navigation links into drawer
  const links = navBar.querySelectorAll('a');
  const drawerLinksContainer = drawer.querySelector('.nav-drawer-links');
  links.forEach(link => {
    const clone = link.cloneNode(true);
    clone.style.display = 'block';
    drawerLinksContainer.appendChild(clone);
  });

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  document.body.appendChild(backdrop);

  // Toggle drawer events
  const closeBtn = drawer.querySelector('.nav-drawer-close');

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('show');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
  };

  hamburgerBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
}

// 10. Live Search Autocomplete (Feature 7)
function initAutocompleteSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchBar = document.querySelector('.search-bar');
  if (!searchInput || !searchBar) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'search-autocomplete-dropdown';
  searchBar.appendChild(dropdown);

  let debounceTimeout;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }

    // Debounce query search by 200ms
    debounceTimeout = setTimeout(() => {
      const results = PRODUCTS_DB.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

      if (results.length === 0) {
        dropdown.innerHTML = '<div style="padding: 10px 14px; color: #999; font-size:12px;">No products found</div>';
      } else {
        dropdown.innerHTML = results.slice(0, 5).map(p => `
          <div class="search-autocomplete-item" data-url="${p.url}?id=${p.id}">
            <img src="${p.image}" alt="${p.name}">
            <div class="search-autocomplete-info">
              <span class="search-autocomplete-title">${p.name}</span>
              <span class="search-autocomplete-price">$${p.price.toFixed(2)}</span>
            </div>
          </div>
        `).join('');

        dropdown.querySelectorAll('.search-autocomplete-item').forEach(item => {
          item.addEventListener('click', () => {
            window.location.href = item.getAttribute('data-url');
          });
        });
      }
      dropdown.classList.add('open');
    }, 200);
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

// 11. Scroll Reveal Animation (Feature 3)
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Add scroll-reveal class to section elements dynamically
  const sections = document.querySelectorAll('.cat-card, .deal-card, .product-card, .service-card, .supplier-item, .request-inner, .newsletter');
  sections.forEach(sec => {
    sec.classList.add('scroll-reveal');
    observer.observe(sec);
  });
}

// 12. Back-To-Top floating button (Feature 19)
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top-btn';
  btn.title = 'Back to top';
  btn.innerHTML = '▲';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 13. Page Specific Logic: Homepage Features (Features 5 & 2)
function initHomepageFeatures() {
  // Feature 5: Deals countdown timer
  const dealsLabel = document.querySelector('.deals-label');
  if (dealsLabel) {
    const timerSpan = document.createElement('span');
    timerSpan.style.marginLeft = '10px';
    timerSpan.style.color = '#ff4444';
    timerSpan.style.fontWeight = '800';
    timerSpan.style.fontSize = '13px';
    dealsLabel.after(timerSpan);

    // Target a specific deal end time (24 hours from current session launch)
    let endTime = localStorage.getItem('deals_countdown_end');
    if (!endTime) {
      endTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('deals_countdown_end', endTime);
    } else {
      endTime = parseInt(endTime);
      if (endTime < Date.now()) {
        endTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('deals_countdown_end', endTime);
      }
    }

    const updateTimer = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        timerSpan.textContent = '00:00:00';
        return;
      }
      const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
      const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      timerSpan.textContent = `Ends in: ${hrs}:${mins}:${secs}`;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // Feature 2: Product card quick add button injection on Homepage
  const productCards = document.querySelectorAll('.products-grid .product-card');
  productCards.forEach((card, idx) => {
    // Associate a mock product database ID matching recommended grid order
    const dbItem = PRODUCTS_DB[idx % PRODUCTS_DB.length];
    card.setAttribute('data-id', dbItem.id);

    const quickAddWrap = document.createElement('div');
    quickAddWrap.className = 'quick-add-container';
    quickAddWrap.innerHTML = `<button class="btn-quick-add">⚡ Quick Add</button>`;
    card.appendChild(quickAddWrap);

    // Quick Add button click listener
    quickAddWrap.querySelector('.btn-quick-add').addEventListener('click', (e) => {
      e.stopPropagation();
      const productImg = card.querySelector('img');
      CartStorage.add(dbItem.id, 1, 'default', 'default');
      triggerFlyAnimation(productImg);
    });

    // Make the entire card clickable to navigate to productdetails.html with id
    card.addEventListener('click', () => {
      window.location.href = `productdetails.html?id=${dbItem.id}`;
    });
  });
}

// 14. Page Specific Logic: Product List Page Features (Features 8, 9, 2)
function initProductListFeatures() {
  const productsContainer = document.querySelector('.product-list');
  if (!productsContainer) return;

  // Enable dynamic filtering / sorting directly in listing using data properties
  const productItems = Array.from(productsContainer.querySelectorAll('.product-item'));

  // Prepare database references on the DOM items
  productItems.forEach((item, index) => {
    // Map existing products index to DB
    const dbItem = PRODUCTS_DB[index % PRODUCTS_DB.length];
    item.setAttribute('data-id', dbItem.id);
    item.setAttribute('data-category', dbItem.category);
    item.setAttribute('data-price', dbItem.price);
    item.setAttribute('data-rating', dbItem.rating);

    // Dynamic Quick Add Button setup
    const info = item.querySelector('.product-info');
    if (info) {
      const qaBtn = document.createElement('button');
      qaBtn.className = 'btn-quick-add';
      qaBtn.style.marginTop = '10px';
      qaBtn.style.width = 'fit-content';
      qaBtn.style.padding = '6px 14px';
      qaBtn.textContent = '⚡ Quick Add';
      qaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        CartStorage.add(dbItem.id, 1);
        triggerFlyAnimation(item.querySelector('.product-img img'));
      });
      info.appendChild(qaBtn);
    }

    // Dynamic wishlist binding
    const wishlist = WishlistStorage.get();
    const isSaved = wishlist.includes(dbItem.id);
    const wishBtn = item.querySelector('.wishlist-btn');
    if (wishBtn) {
      wishBtn.textContent = isSaved ? '♥' : '♡';
      wishBtn.style.color = isSaved ? '#ef4444' : '#cccccc';

      wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const active = WishlistStorage.toggle(dbItem.id);
        wishBtn.textContent = active ? '♥' : '♡';
        wishBtn.style.color = active ? '#ef4444' : '#cccccc';
      });
    }
  });

  // Category Filtering Setup (based on sidebar checks)
  const categoryFilters = document.querySelectorAll('.sidebar-list li a');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
      e.preventDefault();
      categoryFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const selectedCat = filter.textContent.trim();
      filterProducts();
    });
  });

  // Brand Filtering Setup
  const brandChecks = document.querySelectorAll('.sidebar-section:nth-child(2) input[type="checkbox"]');
  brandChecks.forEach(chk => chk.addEventListener('change', filterProducts));

  // Rating sorting & sorting selector
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', sortProducts);
  }

  function filterProducts() {
    const activeCatFilter = document.querySelector('.sidebar-list li a.active');
    const selectedCategory = activeCatFilter ? activeCatFilter.textContent.trim() : 'Mobile Accessory';

    productItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      const isMatch = (selectedCategory === 'Mobile Accessory') || (itemCat === selectedCategory);
      item.style.display = isMatch ? 'flex' : 'none';
    });
  }

  function sortProducts() {
    const criteria = sortSelect.value;
    const items = Array.from(productsContainer.querySelectorAll('.product-item'));

    items.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price'));
      const priceB = parseFloat(b.getAttribute('data-price'));
      const ratingA = parseFloat(a.getAttribute('data-rating'));
      const ratingB = parseFloat(b.getAttribute('data-rating'));

      if (criteria === 'Price: Low to High') return priceA - priceB;
      if (criteria === 'Price: High to Low') return priceB - priceA;
      if (criteria === 'Newest') return b.getAttribute('data-id') - a.getAttribute('data-id');
      return ratingB - ratingA; // Featured/Default (rating based)
    });

    // Re-append sorted
    items.forEach(item => productsContainer.appendChild(item));
  }
}

// 15. Page Specific Logic: Product Details Features (Features 11, 12, 17, 20)
function initProductDetailsFeatures() {
  // Extract ID from URL
  const params = new URLSearchParams(window.location.search);
  let id = params.get('id') || '13'; // Default to ID 13 if no param
  
  const product = PRODUCTS_DB.find(p => p.id === String(id));
  if (!product) return;

  // Add to recently viewed list
  RecentViewStorage.add(id);

  // Dynamic Product details inject
  const mainTitle = document.querySelector('.product-details h1');
  if (mainTitle) mainTitle.textContent = product.name;

  const currentPrice = document.querySelector('.price-current');
  if (currentPrice) currentPrice.textContent = `$${product.price.toFixed(2)}`;

  const mainImg = document.querySelector('.main-img-wrap img');
  if (mainImg) mainImg.src = product.image;

  // Feature 17: Product image gallery hover zoom
  const imgWrap = document.querySelector('.main-img-wrap');
  if (imgWrap && mainImg) {
    imgWrap.addEventListener('mousemove', (e) => {
      const rect = imgWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
      mainImg.style.transform = 'scale(2)';
    });

    imgWrap.addEventListener('mouseleave', () => {
      mainImg.style.transform = 'scale(1)';
    });
  }

  // Feature 20: Stepper + Stock Badge
  const specTable = document.querySelector('.specs-table');
  if (specTable) {
    const qtyRow = document.createElement('tr');
    qtyRow.innerHTML = `
      <td>Quantity:</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-step-minus" style="padding: 2px 8px; cursor: pointer;">-</button>
          <span class="qty-step-value" style="font-weight: 700; font-size: 14px;">1</span>
          <button class="btn-step-plus" style="padding: 2px 8px; cursor: pointer;">+</button>
          <span class="stock-badge" style="margin-left: 10px; padding: 2px 6px; border-radius: 3px; font-size:11px; font-weight:700;"></span>
        </div>
      </td>
    `;
    specTable.appendChild(qtyRow);

    const stepVal = qtyRow.querySelector('.qty-step-value');
    const minus = qtyRow.querySelector('.btn-step-minus');
    const plus = qtyRow.querySelector('.btn-step-plus');
    const stockBadge = qtyRow.querySelector('.stock-badge');

    let currentQty = 1;
    // Set mock stock thresholds based on product ID
    let stockLevel = 10;
    if (id === '13') stockLevel = 3;
    if (id === '14') stockLevel = 0;

    const updateQtyUI = () => {
      stepVal.textContent = currentQty;
      if (stockLevel === 0) {
        stockBadge.textContent = 'Out of Stock';
        stockBadge.style.background = '#ef4444';
        stockBadge.style.color = '#ffffff';
        plus.disabled = true;
        minus.disabled = true;
      } else if (stockLevel <= 3) {
        stockBadge.textContent = `Only ${stockLevel} left!`;
        stockBadge.style.background = '#f59e0b';
        stockBadge.style.color = '#ffffff';
      } else {
        stockBadge.textContent = 'In Stock';
        stockBadge.style.background = '#10b981';
        stockBadge.style.color = '#ffffff';
      }
    };

    minus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        updateQtyUI();
      }
    });

    plus.addEventListener('click', () => {
      if (currentQty < Math.min(10, stockLevel)) {
        currentQty++;
        updateQtyUI();
      }
    });

    updateQtyUI();

    // Rebind add to cart to stepper value
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.href = '#';
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (stockLevel === 0) {
          showToast('Product out of stock', 'warning');
          return;
        }
        CartStorage.add(id, currentQty);
        triggerFlyAnimation(mainImg);
      });
    }
  }

  // Feature 11: Star rating interactive widget injection
  const ratingRow = document.querySelector('.rating-row');
  if (ratingRow) {
    const widgetDiv = document.createElement('div');
    widgetDiv.style.marginTop = '8px';
    widgetDiv.innerHTML = `
      <div style="font-weight: 700; font-size:12px; margin-bottom: 4px;">Leave a Rating:</div>
      <div class="star-rating-widget">
        <input type="radio" id="star5" name="user-rating" value="5"><label for="star5">★</label>
        <input type="radio" id="star4" name="user-rating" value="4"><label for="star4">★</label>
        <input type="radio" id="star3" name="user-rating" value="3"><label for="star3">★</label>
        <input type="radio" id="star2" name="user-rating" value="2"><label for="star2">★</label>
        <input type="radio" id="star1" name="user-rating" value="1"><label for="star1">★</label>
      </div>
    `;
    ratingRow.after(widgetDiv);

    widgetDiv.querySelectorAll('input').forEach(radio => {
      radio.addEventListener('change', () => {
        showToast(`Thank you for rating this ${radio.value} Stars!`, 'success');
      });
    });
  }

  // Feature 12: Recently Viewed Strip rendering
  const tabSection = document.querySelector('.tab-section');
  if (tabSection) {
    const recentDiv = document.createElement('div');
    recentDiv.style.marginTop = '24px';
    recentDiv.innerHTML = `
      <div class="section-title">Recently Viewed</div>
      <div class="recent-views-strip" style="display: flex; gap: 12px; overflow-x: auto; padding: 10px 0;"></div>
    `;
    tabSection.after(recentDiv);

    const strip = recentDiv.querySelector('.recent-views-strip');
    const recents = RecentViewStorage.get().filter(item => item !== String(id));

    if (recents.length === 0) {
      strip.innerHTML = '<span style="color: #999; font-size:11px;">No recently viewed items</span>';
    } else {
      recents.forEach(rid => {
        const item = PRODUCTS_DB.find(p => p.id === rid);
        if (item) {
          const card = document.createElement('div');
          card.style.background = '#ffffff';
          card.style.border = '1px solid #eeeeee';
          card.style.borderRadius = '4px';
          card.style.padding = '8px';
          card.style.minWidth = '110px';
          card.style.textAlign = 'center';
          card.style.cursor = 'pointer';
          card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; margin: 0 auto 4px;">
            <div style="font-size: 10px; color: #444; height: 26px; overflow: hidden; line-height:1.3;">${item.name}</div>
            <div style="font-size: 11px; font-weight:700; margin-top:2px;">$${item.price.toFixed(2)}</div>
          `;
          card.addEventListener('click', () => {
            window.location.href = `productdetails.html?id=${item.id}`;
          });
          strip.appendChild(card);
        }
      });
    }
  }
}

// 16. Page Specific Logic: Cart Page Features (Features 6, 13, 14)
function initCartPageFeatures() {
  const cartContainer = document.querySelector('.cart-card');
  if (!cartContainer) return;

  let appliedCoupon = null;

  const renderCartItems = () => {
    const items = CartStorage.get();
    const cartCountTitle = document.querySelector('.main h1');
    
    if (cartCountTitle) {
      const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
      cartCountTitle.textContent = `My cart (${totalCount})`;
    }

    if (items.length === 0) {
      cartContainer.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #999;">
          <h2 style="font-size:18px; margin-bottom: 10px;">Your cart is empty</h2>
          <a href="products.html" style="color: #3b82f6; font-weight:700; text-decoration:underline;">Go shopping</a>
        </div>
      `;
      updateTotals(0);
      return;
    }

    cartContainer.innerHTML = items.map(item => {
      const product = PRODUCTS_DB.find(p => p.id === item.id);
      if (!product) return '';
      return `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
          <div class="item-img">
            <img src="${product.image}" alt="${product.name}" width="44" height="44" />
          </div>
          <div class="item-info">
            <div class="item-name">${product.name}</div>
            <div class="item-meta">Size: ${item.size}, Color: ${item.color}</div>
            <div class="item-actions">
              <button class="btn-link btn-remove-item">Remove</button>
            </div>
          </div>
          <div class="item-right">
            <div class="item-price">$${(product.price * item.qty).toFixed(2)}</div>
            <div class="qty-selector" style="margin-top: 6px;">
              <select class="select-item-qty">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => `<option value="${q}" ${item.qty === q ? 'selected' : ''}>Qty: ${q}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Rebind action events
    cartContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemRow = e.target.closest('.cart-item');
        const id = itemRow.getAttribute('data-id');
        const size = itemRow.getAttribute('data-size');
        const color = itemRow.getAttribute('data-color');
        CartStorage.remove(id, size, color);
        renderCartItems();
      });
    });

    cartContainer.querySelectorAll('.select-item-qty').forEach(select => {
      select.addEventListener('change', (e) => {
        const itemRow = e.target.closest('.cart-item');
        const id = itemRow.getAttribute('data-id');
        const size = itemRow.getAttribute('data-size');
        const color = itemRow.getAttribute('data-color');
        const qty = e.target.value;
        CartStorage.updateQty(id, qty, size, color);
        renderCartItems();
      });
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const p = PRODUCTS_DB.find(prod => prod.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    updateTotals(subtotal);
  };

  const updateTotals = (subtotal) => {
    let discount = 0;
    if (appliedCoupon === 'SAVE10') {
      discount = subtotal * 0.1;
    } else if (appliedCoupon === 'SAVE20') {
      discount = subtotal * 0.2;
    }

    const tax = subtotal > 0 ? 14.00 : 0;
    const total = Math.max(0, subtotal - discount + tax);

    // Update summary labels
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const subtotalSpan = sidebar.querySelector('.summary-row:nth-child(1) span:last-child');
      const discountSpan = sidebar.querySelector('.summary-row:nth-child(2) span:last-child');
      const taxSpan = sidebar.querySelector('.summary-row:nth-child(3) span:last-child');
      const totalSpan = sidebar.querySelector('.summary-total span:last-child');

      if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
      if (discountSpan) discountSpan.textContent = `-$${discount.toFixed(2)}`;
      if (taxSpan) taxSpan.textContent = `+$${tax.toFixed(2)}`;
      if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
    }
  };

  // Feature 13: Coupon code input handler
  const couponInput = document.querySelector('.coupon-input');
  const applyBtn = document.querySelector('.btn-apply');
  if (couponInput && applyBtn) {
    applyBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'SAVE10' || code === 'SAVE20') {
        appliedCoupon = code;
        showToast(`Coupon ${code} Applied!`, 'success');
        renderCartItems();
      } else {
        showToast('Invalid coupon code', 'warning');
      }
    });
  }

  // Remove All action
  const removeAllBtn = document.querySelector('.btn-remove-all');
  if (removeAllBtn) {
    removeAllBtn.addEventListener('click', () => {
      CartStorage.clear();
      renderCartItems();
    });
  }

  // Feature 14: Order Confirmation Modal
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    // Override onclick attribute
    checkoutBtn.removeAttribute('onclick');

    // Create Modal Elements dynamically
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close-btn">&times;</button>
        <div style="font-size: 44px; color: #10b981; margin-bottom: 12px;">✓</div>
        <h2 style="margin-bottom: 10px;">Order Confirmed!</h2>
        <p style="margin-bottom: 16px; font-size:12px; color: #777;">Thank you for shopping with us. Your order has been successfully processed.</p>
        <div style="border: 1px solid #eee; border-radius: 6px; padding: 14px; text-align: left; margin-bottom: 20px; font-size: 13px;">
          <div><strong>Order Number:</strong> <span class="modal-order-number">#EC-92849</span></div>
          <div style="margin-top: 6px;"><strong>Delivery:</strong> 3-5 Business Days</div>
          <div style="margin-top: 6px;"><strong>Total Amount Paid:</strong> <span class="modal-total-paid">$0.00</span></div>
        </div>
        <button class="btn-modal-close" style="background: #3b82f6; color:#fff; border:none; padding:8px 20px; border-radius:4px; font-weight:700; cursor:pointer;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.classList.remove('open');
      CartStorage.clear();
      renderCartItems();
    };

    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.btn-modal-close').addEventListener('click', closeModal);

    checkoutBtn.addEventListener('click', () => {
      const items = CartStorage.get();
      if (items.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
      }

      // Populate summary totals inside modal
      const totalSpan = document.querySelector('.summary-total span:last-child');
      modal.querySelector('.modal-total-paid').textContent = totalSpan ? totalSpan.textContent : '$0.00';
      modal.querySelector('.modal-order-number').textContent = `#EC-${Math.floor(100000 + Math.random() * 900000)}`;

      modal.classList.add('open');
    });
  }

  // Initial render
  renderCartItems();
}
