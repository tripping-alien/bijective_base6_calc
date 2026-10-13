# 🧮 Bijective Base-6 Calculator & Explorer

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-22c55e?style=for-the-badge&logo=github)](https://tripping-alien.github.io/bijective_base6_calc/)
[![CI Test Suite](https://img.shields.io/github/actions/workflow/status/tripping-alien/bijective_base6_calc/ci.yml?branch=main&style=for-the-badge&label=CI%20Build)](https://github.com/tripping-alien/bijective_base6_calc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla%20JS)-success?style=flat-square)](static/script.js)
[![Languages](https://img.shields.io/badge/i18n-8%20Languages-blue?style=flat-square)](locales/)

An interactive web application and educational explorer for the **bijective base-6 numeral system**—a non-standard positional number system with **no zero**, using the digits `1, 2, 3, 4, 5, 6`. Designed for software engineers, mathematicians, educators, and computer science students, this client-side educational suite provides real-time radix conversion, arbitrary-precision bijective arithmetic, automated practice quizzes, lookup tables, and an algorithmic study guide.

Hosted live on GitHub Pages at **[https://tripping-alien.github.io/bijective_base6_calc/](https://tripping-alien.github.io/bijective_base6_calc/)**.

---

![Bijective Base-6 Calculator Application Screenshot](assets/screenshot.jpg)

---

## 📑 Table of Contents

- [Overview & Key Concepts](#-what-is-bijective-base-6)
- [Comparison: Decimal vs Senary vs Bijective Base-6](#-quick-reference-comparison-table)
- [Features](#-features)
- [Mathematical Algorithms & Implementation](#-mathematical-algorithms)
  - [Decimal to Bijective Base-6](#1-decimal-to-bijective-base-6)
  - [Bijective Base-6 to Decimal](#2-bijective-base-6-to-decimal)
  - [Bijective Column Addition](#3-bijective-column-addition)
  - [Bijective Column Subtraction](#4-bijective-column-subtraction)
- [Internationalization (i18n)](#-internationalization-8-languages)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Deployment on GitHub Pages](#-hosting-on-github-pages)
- [Running Locally & Testing](#-running-locally)
- [Frequently Asked Questions (FAQ)](#-frequently-asked-questions)
- [Community & Contributing](#-contributing)
- [Citation](#-citation)
- [License](#-license)

---

## 💡 What is Bijective Base-6?

**Bijective base-6** (also referred to as *1-based senary* or *zero-free base-6*) is a positional numeral system with base $k = 6$ and the digit set:

$$\mathcal{D} = \{1, 2, 3, 4, 5, 6\}$$

Unlike conventional number systems (such as standard decimal $0\dots9$ or standard senary $0\dots5$), bijective base-6 has **no zero digit**:

1. **No Zero Representation**: Every position in a number represents a strictly non-zero value between $1$ and $6$.
2. **True Bijection ($1 \leftrightarrow 1$)**: There is an exact 1-to-1 bijection between all positive integers $\mathbb{N}^+$ and non-empty digit strings over $\{1, 2, 3, 4, 5, 6\}^*$.
3. **No Leading Zero Ambiguities**: In standard base-6, values like $5$, $05$, and $005$ denote the same numerical quantity, introducing identifier parsing ambiguities. In bijective base-6, every representation is strictly unique.

Counting proceeds like an odometer that cannot display zero:

$$1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5 \rightarrow 6 \rightarrow 11 \rightarrow 12 \dots 16 \rightarrow 21 \dots 66 \rightarrow 111$$

This mechanism is identical to the way **spreadsheet columns** (such as Microsoft Excel or Google Sheets) are labeled with letters: $A\dots Z$, followed by $AA\dots AZ$, rollover to $BA$, through $ZZ$, then $AAA$.

---

## 📊 Quick Reference Comparison Table

| Decimal (Base 10) | Standard Senary (Base 6, digits 0–5) | Bijective Base-6 (Base 6, digits 1–6) | Mathematical Interpretation |
| :---: | :---: | :---: | :--- |
| **1** | `1` | `1` | $1 \times 6^0 = 1$ |
| **5** | `5` | `5` | $5 \times 6^0 = 5$ |
| **6** | `10` | `6` | $6 \times 6^0 = 6$ *(No rollover needed!)* |
| **7** | `11` | `11` | $1 \times 6^1 + 1 \times 6^0 = 6 + 1 = 7$ |
| **12** | `20` | `16` | $1 \times 6^1 + 6 \times 6^0 = 6 + 6 = 12$ |
| **35** | `55` | `55` | $5 \times 6^1 + 5 \times 6^0 = 30 + 5 = 35$ |
| **36** | `100` | `56` | $5 \times 6^1 + 6 \times 6^0 = 30 + 6 = 36$ |
| **42** | `110` | `66` | $6 \times 6^1 + 6 \times 6^0 = 36 + 6 = 42$ |
| **43** | `111` | `111` | $1 \times 6^2 + 1 \times 6^1 + 1 \times 6^0 = 36 + 6 + 1 = 43$ |
| **216** | `1000` | `556` | $5 \times 6^2 + 5 \times 6^1 + 6 \times 6^0 = 180 + 30 + 6 = 216$ |
| **258** | `1110` | `666` | $6 \times 6^2 + 6 \times 6^1 + 6 \times 6^0 = 216 + 36 + 6 = 258$ |
| **259** | `1111` | `1111` | $1 \times 6^3 + 1 \times 6^2 + 1 \times 6^1 + 1 \times 6^0 = 259$ |

---

## ✨ Features

- **⚡ Real-Time Radix Converter**: Dynamically convert any positive integer between Decimal, Binary, Hexadecimal, Standard Base-6, and Bijective Base-6 with preset quick-chips.
- **➕ Bijective Arithmetic Engine**: Calculate addition ($+$), subtraction ($-$), multiplication ($\times$), and integer division ($\div$) directly on bijective base-6 numbers with interactive digit pads.
- **📚 Interactive Study Guide**: Step-by-step algorithms, visual column-by-column carry/borrow breakdowns, and an analysis of engineering pros & cons.
- **📋 24×24 Dynamic Reference Tables**: Pre-calculated lookup grids for bijective addition and multiplication to identify modular patterns and symmetries.
- **🎯 Adaptive Practice Mode**: Test conversion and arithmetic skills across Easy, Medium, and Hard difficulty tiers with immediate interactive feedback.
- **🌍 Instant Internationalization**: Native support for **8 languages** with RTL support and pre-bundled dictionary payloads (zero network latency).
- **🌓 Dual-Theme Glassmorphic UI**: High-contrast Dark and Light modes with interactive mathematical particle background animations.

---

## 🧮 Mathematical Algorithms

### 1. Decimal to Bijective Base-6

To convert an integer $n \in \mathbb{N}^+$ to bijective base-6:

```python
def to_bijective_base6(n: int) -> str:
    if n <= 0:
        raise ValueError("Bijective base-6 represents strictly positive integers.")
    digits = "123456"
    result = ""
    while n > 0:
        rem = (n - 1) % 6
        result = digits[rem] + result
        n = (n - 1) // 6
    return result
```

### 2. Bijective Base-6 to Decimal

To evaluate a bijective digit string $d_k d_{k-1} \dots d_1 d_0$:

$$n = \sum_{i=0}^{k} d_i \cdot 6^i$$

```python
def from_bijective_base6(s: str) -> int:
    val = 0
    for char in s:
        digit = int(char)
        if not (1 <= digit <= 6):
            raise ValueError("Digits must be in range 1..6")
        val = val * 6 + digit
    return val
```

### 3. Bijective Column Addition

When adding digits column-by-column with a carry:

$$\text{digit} = ((d_1 + d_2 + \text{carry} - 1) \pmod 6) + 1$$

$$\text{new\_carry} = \left\lfloor \frac{d_1 + d_2 + \text{carry} - 1}{6} \right\rfloor$$

### 4. Bijective Column Subtraction

When borrowing from an adjacent column in bijective base-6, borrow a value of **6** (rather than 10). If digit $d_1 < d_2$, decrement the next column by 1 and compute $(d_1 + 6) - d_2$.

---

## 🌐 Internationalization (8 Languages)

The application includes complete native translations with RTL (Right-to-Left) script support:

| Language | Code | Script Direction | Flag |
| :--- | :---: | :---: | :---: |
| **English** | `en` | LTR | 🇺🇸 |
| **Русский** (Russian) | `ru` | LTR | 🇷🇺 |
| **Deutsch** (German) | `de` | LTR | 🇩🇪 |
| **Français** (French) | `fr` | LTR | 🇫🇷 |
| **עברית** (Hebrew) | `he` | RTL | 🇮🇱 |
| **العربية** (Arabic) | `ar` | RTL | 🇸🇦 |
| **中文** (Simplified Chinese) | `zh` | LTR | 🇨🇳 |
| **日本語** (Japanese) | `ja` | LTR | 🇯🇵 |

Language can be switched in real-time via the settings modal or loaded directly using the URL query parameter (e.g. `https://tripping-alien.github.io/bijective_base6_calc/?lang=ru` or `?lang=de`).

---

## 🛠️ Tech Stack & Architecture

- **Core**: HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript.
- **Zero External Dependencies**: Operates 100% offline and client-side; no Node runtime or heavy framework bundle required.
- **FastAPI Companion Backend**: Included in `app.py` for headless unit testing, endpoint benchmarking, and optional containerized hosting.
- **Automated Testing Suite**:
  - `static/script.test.js`: 1,012 client-side unit test assertions verifying bijective arithmetic and conversion edge cases.
  - `test_app.py`: Pytest suite verifying server endpoints and algorithmic parity.

---

## 🌐 Hosting on GitHub Pages

This repository is pre-configured for automated deployment to **GitHub Pages**:

1. In repository settings, navigate to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions** (or **Deploy from a branch** with branch `main` and folder `/ (root)`).
3. Pushes to `main` automatically trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) to deploy to [GitHub Pages](https://tripping-alien.github.io/bijective_base6_calc/).
4. The root [`.nojekyll`](.nojekyll) file ensures unconstrained static file delivery without Jekyll preprocessing.

---

## 🚀 Running Locally

### Option 1: Direct In-Browser (Zero Installation)
Open `index.html` directly in your web browser, or run a local static server:

```bash
# Using Python:
python -m http.server 8000

# Or using Node:
npx serve .
```
Navigate to `http://localhost:8000`.

### Option 2: Using the Optional FastAPI Dev Server

```bash
# Clone the repository
git clone https://github.com/tripping-alien/bijective_base6_calc.git
cd bijective_base6_calc

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app:app --reload --port 8000
```

### Running Test Suites

```bash
# Run 1,000+ client-side JS unit tests
node static/script.test.js

# Run Python API tests
pytest
```

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>Why is there no zero in bijective base-6?</strong></summary>

In standard positional numeral systems with radix $k$, digits range from $0$ to $k-1$. In a bijective base-$k$ system, digits range from $1$ to $k$. By shifting the digit set away from zero, every positive integer maps to exactly one string without redundant leading zeros (e.g., $7$ is solely represented by $11$, never $011$).
</details>

<details>
<summary><strong>What happens when an odometer rolls over in bijective base-6?</strong></summary>

In decimal, after $9$ comes $10$. In standard base-6, after $5$ comes $10$. In bijective base-6, after $5$ comes $6$ (a single digit!). The rollover only happens after $6$, producing $11$.
</details>

<details>
<summary><strong>Where are bijective number systems used in practice?</strong></summary>

The most recognizable real-world application of bijective numeration is **spreadsheet column naming** (bijective base-26 with digits `A` through `Z`). Other applications include bijective base-64 URL shorteners, unambiguous database primary keys, and algorithmic serializations where leading zeroes cause silent truncation errors.
</details>

<details>
<summary><strong>Can bijective base-6 represent negative numbers or zero?</strong></summary>

Pure bijective numeration is defined over positive integers $\mathbb{N}^+ = \{1, 2, 3, \dots\}$. Zero can be denoted as an empty string $\epsilon$ or handled with an explicit sign token, and negative integers are indicated by a unary minus sign (e.g., $-14$).
</details>

---

## 🤝 Contributing

Contributions, bug reports, and translation improvements are welcome!

1. Check existing issues or open a new [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) or [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md).
2. Review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).
3. Fork the repository, create your branch (`git checkout -b feature/my-feature`), commit changes, and submit a Pull Request.

---

## 📜 Citation

If you use or reference this project in academic research, educational material, or software documentation, please cite it using [`CITATION.cff`](CITATION.cff):

```bibtex
@software{bijective_base6_calc,
  author = {tripping-alien},
  title = {Bijective Base-6 Calculator & Explorer},
  url = {https://tripping-alien.github.io/bijective_base6_calc/},
  year = {2026},
  note = {GitHub Repository: https://github.com/tripping-alien/bijective_base6_calc}
}
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
