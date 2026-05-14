---
name: testing-shark-shop
description: Test the Shark Shop static website end-to-end. Use when verifying UI changes, Three.js 3D rendering, product catalog, or form functionality.
---

# Testing Shark Shop Website

## Overview
Shark Shop is a static frontend site (HTML/CSS/JS) with no backend. It uses Three.js for 3D shark rendering.

## Deployment
- Deploy using `deploy frontend` tool pointed at the repo root (contains index.html, style.css, script.js)
- The site will be available at a `*.devinapps.com` URL

## Key Test Areas

### 1. Three.js 3D Sharks
- **Hero shark** (`#sharkCanvas`): Should render a 3D shark with body, fins, glowing cyan eyes. Follows mouse movement.
- **About shark** (`#aboutSharkCanvas`): Wireframe shark with rotating rings.
- Verify via browser console: `typeof THREE !== 'undefined'` should be true, and check for zero errors.
- If canvas appears blank/black, Three.js CDN (cdnjs r128) might be down — check network tab.

### 2. Product Catalog
- 6 categories expected: Сигареты, Снюс, Жижи, Одноразки, Картриджи, Подики
- Each card has SVG icon, title, description, position count
- Verify with: `document.querySelectorAll('.product-card').length === 6`

### 3. Contact Form
- Fill name + phone fields, click "Отправить"
- Button should change to "Отправлено!" with green gradient
- After 2.5 seconds, button reverts and form clears
- No backend — form is client-side only

### 4. Navigation
- Smooth scroll via anchor links (#products, #about, #advantages, #contact)
- Sticky nav gets `.scrolled` class with backdrop-blur when scrollY > 50

### 5. Counters
- Hero stats animate from 0 to target values: 500, 3000, 5
- Triggered by IntersectionObserver when `.hero-stats` enters viewport

### 6. Localization
- All UI text must be in Russian
- Footer must show: "18+ Продажа лицам старше 18 лет"

## Devin Secrets Needed
None — pure static site with no authentication.

## Tips
- The preloader takes ~1.2s to disappear. Wait before interacting.
- Cursor glow effect only appears on mousemove events.
- Russian text input might not work via `type` tool — use JavaScript `element.value = '...'` as fallback for Cyrillic.
