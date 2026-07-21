# SmartShop SPA

A responsive e-commerce single-page application built with Vue 3, TypeScript, Vite, and Tailwind CSS. It provides product browsing, authentication, cart management, checkout, local order history, and dark-mode support.

Live site: [smartshop-spa.vercel.app](https://smartshop-spa.vercel.app/)

## Features

- Browse, search, filter, and sort products
- View product details and image galleries
- Register and sign in with local demo accounts
- Add products to a persistent shopping cart
- Checkout with card or cash-on-delivery options
- Store orders and registered users in browser local storage
- Responsive layout and dark mode
- Client-side routing that works on Vercel

## Tech stack

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DummyJSON](https://dummyjson.com/) product and demo-auth API

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
git clone https://github.com/kpavith-dev/smartshop-spa.git
cd smartshop-spa
npm ci
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Deployment

The app is configured for Vercel through `vercel.json`; client-side routes are rewritten to `index.html` so pages such as `/cart` and `/product/1` work after deployment.

For GitHub Pages builds, set `GITHUB_PAGES=true`. The Vite base path will then use `/smartshop-spa/`.

## Notes

- Cart, authentication, registered-user, and order data are stored in the browser's local storage.
- Payments are simulated; no real card information is sent or charged.
- Product data is loaded from DummyJSON, with fallback products on the home page if the API is unavailable.

## License

This project is for learning and demonstration purposes.
