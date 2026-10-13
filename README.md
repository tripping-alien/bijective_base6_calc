# Bijective Base-6 Calculator & Explorer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://base6.art)
[![Framework](https://img.shields.io/badge/Framework-FastAPI-green?style=flat-square)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/tripping-alien/bijective_base6_calc/blob/main/LICENSE)

An interactive web app for exploring the **bijective base-6 number system**—a system with no zero. This educational tool features a hands-on calculator, a live number system converter, detailed explanations, and a configurable practice mode, all presented in a clean, Nord-inspired dark theme.
Dive into the fascinating world of zero-less mathematics with this interactive web application dedicated to the **bijective base-6 number system**. More than just a calculator, this educational tool provides in-depth explanations, a configurable practice mode, and full support for 9 languages. Explore a number system used in modern computing, from spreadsheet columns to URL shorteners, all within a polished, Nord-inspired interface.

---

![Application Screenshot](assets/screenshot.jpg)

---

## Table of Contents

- [Features](#-features)
- [What is Bijective Base-6?](#-what-is-bijective-base-6)
- [Tech Stack & Rationale](#-tech-stack--rationale)
- [Running Locally](#-running-locally)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Live Conversion Explorer**: Instantly see any decimal number represented in Decimal, Binary, Hexadecimal, and Bijective Base-6.
- **Bijective Calculator**: Perform addition, subtraction, multiplication, and division directly with bijective base-6 numbers.
- **Educational Content**: A dedicated "Study" tab tailored for engineers, explaining the practical pros and cons and teaching the algorithms for manual calculation.
- **Configurable Practice Mode**: Test your skills with math or conversion problems across Easy, Medium, and Hard difficulty levels.
- **Reference Tables**: View pre-calculated 24x24 Addition and Multiplication tables to easily see patterns.
- **Polished UI**: A clean, responsive, dual-theme interface that's easy on the eyes.

---

## 💡 What is Bijective Base-6?

This application is an educational tool for exploring **bijective base-6 numeration**. Unlike standard number systems, it has two key properties:

1.  **No Zero**: The digits are `1, 2, 3, 4, 5, 6`.
2.  **Bijective**: Every positive integer has one, and only one, unique string representation (e.g., `7` is always `11`, never `011`).

Counting proceeds like an odometer that can't show zero. After `6`, the next number "rolls over" to `11`. This property makes it incredibly useful in computer science for creating compact, unambiguous identifiers.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **HTML5 & Vanilla CSS3** | Clean, semantic structure with a custom glassmorphic design system and fluid responsiveness. |
| **Vanilla JavaScript (ES6+)** | 100% client-side computation for all bijective arithmetic, conversions, reference table generation, and practice mode. |
| **Zero Backend Required** | Operates entirely in the browser—deployable to GitHub Pages, Cloudflare, Netlify, or opened directly as `index.html`. |
| **Pre-Bundled i18n Engine** | Instant language switching across 8 languages with zero network latency (`static/locales-data.js`). |
| **Python / FastAPI (Optional)** | Included in `app.py` as an optional local dev server and API suite with automated `pytest` verification. |

---

## 🚀 Running Locally

### Option 1: Direct In-Browser (Zero Installation)
Simply double-click `index.html` in your file explorer, or serve it with any static web server:

```sh
# Using Python's built-in static server:
python -m http.server 8000

# Or using Node's npx serve:
npx serve .
```
Then open `http://localhost:8000` in your web browser.

### Option 2: Using the Optional FastAPI Server

1. **Clone the repository:**
   ```sh
   git clone https://github.com/tripping-alien/bijective_base6_calc.git
   cd bijective_base6_calc
   ```
2. **Install requirements & run:**
   ```sh
   pip install -r requirements.txt
   uvicorn app:app --reload
   ```
3. Open `http://127.0.0.1:8000`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
