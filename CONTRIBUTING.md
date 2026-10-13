# Contributing to Bijective Base-6 Calculator & Explorer

Thank you for your interest in contributing! This project is an open-source educational tool designed to explore and learn bijective base-6 mathematics.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How You Can Contribute

- **Report Bugs**: Help us catch unexpected calculation behaviors, browser layout bugs, or translation issues.
- **Improve Documentation & Explanations**: Make the educational explanations easier to understand for learners.
- **Add or Refine Translations**: Expand support for additional languages in the `locales/` directory.
- **Propose Features**: Suggest interactive teaching tools, visualizations, or practice modes.

## Development Setup

The project is **100% client-side** (HTML5, Vanilla CSS3, Vanilla JavaScript), with an optional Python backend for automated API testing.

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/bijective_base6_calc.git
   cd bijective_base6_calc
   ```

2. **Run locally without any installation**:
   Simply open `index.html` in your browser, or start a local static server:
   ```bash
   python -m http.server 8000
   ```

3. **Run unit tests**:
   - Client-side unit tests:
     ```bash
     node static/script.test.js
     ```
   - Python test suite:
     ```bash
     pip install -r requirements.txt
     pytest
     ```

## Adding or Updating Translations

Translations are stored in `locales/<lang>.json` and pre-bundled in `static/locales-data.js`.
If you update or add a language file in `locales/`:
1. Ensure all keys from `locales/en.json` are present.
2. Re-bundle `static/locales-data.js` by running:
   ```bash
   python -c "import json, glob, os; locales = {os.path.splitext(os.path.basename(f))[0]: json.load(open(f, encoding='utf-8')) for f in sorted(glob.glob('locales/*.json'))}; open('static/locales-data.js', 'w', encoding='utf-8').write('window.LOCALES = ' + json.dumps(locales, ensure_ascii=False, indent=2) + ';\n')"
   ```

## Pull Request Guidelines

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes with clear, descriptive commit messages.
3. Verify that tests pass:
   ```bash
   node static/script.test.js
   pytest
   ```
4. Push your branch and open a Pull Request against `main`.
