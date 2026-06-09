# 🛒 LUXE E-Commerce Front-End (Premium Smart Evolution)

A state-of-the-art, fully responsive, and premium e-commerce front-end application built purely with **Vanilla HTML, CSS, and JavaScript**. Designed from scratch to serve as a high-end university final project and portfolio showcase, this application adheres to a clean, SaaS-like modern design system inspired by top industry standards (Shopify, Stripe, and modern dashboards).

---

## 🚀 Live Demo & Preview
This project consists of 4 main layouts linked dynamically with seamless cross-page data consistency through `localStorage` state synchronization:

*   **Homepage (`homepage.html`)**: Features category sidebars, premium hero slider banners, limited-time countdown timers, interactive recommended feeds, service cards, and newsletter systems.
*   **Product List (`products.html`)**: Includes advanced category sidebar filtering, brand/rating checkboxes, list/grid layout view toggling, price-based sorting, pagination, and a wishlist system.
*   **Product Details (`productdetails.html`)**: Displays detailed information for individual products, rating star widgets, thumbnail image gallerias, interactive Zoom hovers, stock badges, quantities, and a recently viewed carousel.
*   **Shopping Cart (`cart.html`)**: Overview of selected items, quantity dropdown updates, coupon systems (e.g., `SAVE10`, `SAVE20`), pricing breakdowns, and an order confirmation receipt modal.

---

## ✨ Upgraded Features & Implementation Notes

The application features 20 interactive modules:

### 1. Unified State & Cart Engine
*   **Persistent Storage**: Cart, Wishlist, and Recent Views are fully synced in `localStorage`.
*   **Fly-to-Cart Animation**: Triggered upon clicking any "Quick Add" or "Add to Cart" button, creating a smooth curved image path flying toward the cart icon.
*   **Live Badges**: Dynamic indicators on header icons bump with subtle bounce micro-animations when products are added.

### 2. Modern Design System & Overhaul
*   **Palette**: White slate body background (`#F8FAFC`), deep Slate secondary (`#0F172A`), royal Blue primary (`#2563EB`), and Safety Orange accents (`#F97316`).
*   **Typography**: Upgraded from standard fonts to **Google Fonts Inter** for optimal legibility.
*   **Border-radius**: Harmonious curves ranging from `6px` for small indicators up to `12px–16px` for prominent cards and banners.
*   **Shadows**: Soft elevation drop shadows (`box-shadow`) replacing old black borders, creating a lightweight "glassmorphism" look.

### 3. Header & Navigation Refinements
*   **Sticky Shrinking Header**: The header pins to the viewport top on scroll, shrinking padding and adding a light shadow for clean visibility as the user browses.
*   **Search Autocomplete**: The search input debounces input queries to look up mock catalog entries in real-time, displaying a dropdown with matches, prices, and small thumbnails.
*   **Responsive Side Drawer**: Hamburger button in nav bar toggles a slide-out drawer on mobile for seamless navigation.

### 4. Interactive Components
*   **Hero Banner Slider**: Automated slide cycling with manually active dots and arrow navigation buttons.
*   **Countdown Deals Timer**: Features a ticking live timer calculated dynamically relative to session launch.
*   **Hover Image Zoom**: Hovering over the main product image in details scales up the view inside the image container, following the user’s cursor dynamically.
*   **Rating Selector Widget**: Clickable star widgets that fire success confirmation toasts upon rating.
*   **Order Confirmation Modal**: A customized success card that generates a random order ID (e.g., `#EC-481928`), formats checkout totals, and triggers cart clearances.

---

## 📁 Project Structure

```text
E-Commerce/
├── CSS/
│   ├── style.css           # Modernized homepage layout stylesheets
│   ├── products.css        # Product list layout stylesheet
│   ├── productdetails.css  # Detailed description page stylesheet
│   ├── cart.css            # Shopping cart overview stylesheet
│   └── global.css          # Shared utility styles, dark/light theme tokens, and animations
├── js/
│   └── app.js              # Central JavaScript database, helper storage utilities, and interactive triggers
├── Images/                 # High-resolution product images and vector logos
├── homepage.html           # E-commerce landing portal
├── products.html           # Catalog page with sorting/filtering
├── productdetails.html     # Single product detail view
└── cart.html               # Persistent shopping cart checkout page
```

---

## 🛠️ Technologies Used
*   **Structure**: Semantic HTML5 (incorporating WAI-ARIA labels for accessible form validation)
*   **Styling**: Custom CSS3 variables, CSS Grid, and Flexbox (100% framework-free)
*   **Logic**: ES6 JavaScript (localStorage, IntersectionObserver, Debouncing, and Event Handlers)
*   **Vector Art**: Clean SVG formats to support high-DPI displays

---

## 💻 How to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/alihassansumbal/E-commerce-front-end.git
   ```
2. **Navigate to the Folder:**
   ```bash
   cd E-commerce-front-end
   ```
3. **Run with local Server:**
   For absolute pathing assets, autocomplete search, and transitions to work, it is recommended to serve files via a local HTTP server:
   *   **Python**: `python -m http.server 8000` (then open `http://localhost:8000/homepage.html`)
   *   **VS Code**: Right-click `homepage.html` -> **Open with Live Server**.
