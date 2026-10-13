/**
 * Bijective Base-6 Calculator & Explorer
 * 100% Client-Side Pure JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    let i18nData = {};
    let lastActiveInput = null;

    // --- Core Bijective Logic ---
    const toBijective = (n) => {
        try {
            if (n === null || n === undefined || isNaN(n) || n <= 0) return "(N/A)";
            const chars = "123456";
            let result = '';
            let val = Math.floor(n);
            while (val > 0) {
                result = chars[(val - 1) % 6] + result;
                val = Math.floor((val - 1) / 6);
            }
            return result;
        } catch (err) {
            console.error("Error in toBijective:", err);
            return "(Error)";
        }
    };

    const fromBijective = (s) => {
        if (!s || typeof s !== 'string') throw new Error("Input cannot be empty.");
        const clean = s.trim();
        if (!/^[1-6]+$/.test(clean)) {
            throw new Error("Invalid bijective base-6 number. Digits must be strictly 1 to 6 (no zero).");
        }
        let n = 0;
        for (let char of clean) {
            n = n * 6 + parseInt(char, 10);
        }
        return n;
    };

    // --- Internationalization (i18n) Logic ---
    const supportedLangs = {
        'en': { flag: 'us', name: 'English' },
        'ru': { flag: 'ru', name: 'Русский' },
        'de': { flag: 'de', name: 'Deutsch' },
        'fr': { flag: 'fr', name: 'Français' },
        'he': { flag: 'il', name: 'עברית' },
        'ar': { flag: 'sa', name: 'العربية' },
        'zh': { flag: 'cn', name: '中文' },
        'ja': { flag: 'jp', name: '日本語' }
    };

    async function setLanguage(lang) {
        if (!supportedLangs[lang]) {
            console.warn(`Language '${lang}' not supported.`);
            lang = 'en';
        }
        try {
            // Check bundled locales first (instant, 100% offline & file:// protocol safe)
            if (window.LOCALES && window.LOCALES[lang]) {
                i18nData = window.LOCALES[lang];
            } else {
                // Fallback to fetch for static servers if bundle missing
                const response = await fetch(`locales/${lang}.json`);
                if (response.ok) {
                    i18nData = await response.json();
                } else if (window.LOCALES && window.LOCALES['en']) {
                    i18nData = window.LOCALES['en'];
                }
            }

            applyTranslations(i18nData);
            htmlElement.setAttribute('lang', lang);
            htmlElement.dir = ['he', 'ar'].includes(lang) ? 'rtl' : 'ltr';
            localStorage.setItem('language', lang);
            updateSeoLangTags(lang);
        } catch (error) {
            console.error(`Error setting language to ${lang}:`, error);
            if (window.LOCALES && window.LOCALES['en']) {
                i18nData = window.LOCALES['en'];
                applyTranslations(i18nData);
            }
        }
    }

    function updateSeoLangTags(currentLang) {
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
        if (!window.location.protocol.startsWith('http')) return;
        const head = document.head;
        const baseUrl = window.location.origin + window.location.pathname;

        for (const langCode in supportedLangs) {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = langCode;
            link.href = `${baseUrl}?lang=${langCode}`;
            head.appendChild(link);
        }
    }

    function applyTranslations(data) {
        if (!data) return;
        if (data.pageTitle) document.title = data.pageTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.pageDescription) metaDesc.setAttribute('content', data.pageDescription);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (data[key] !== undefined) el.innerHTML = data[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (data[key] !== undefined) el.placeholder = data[key];
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.dataset.i18nAriaLabel;
            if (data[key] !== undefined) el.setAttribute('aria-label', data[key]);
        });
        document.querySelectorAll('[data-i18n-property]').forEach(el => {
            const prop = el.dataset.i18nProperty;
            const key = prop.includes(':') ? prop.split(':')[1] : prop;
            if (data[key] !== undefined) el.setAttribute('content', data[key]);
        });
        document.querySelectorAll('[data-i18n-list]').forEach(ul => {
            const key = ul.dataset.i18nList;
            if (data[key] && Array.isArray(data[key])) {
                ul.innerHTML = data[key].map(item => `<li>${item}</li>`).join('');
            }
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            if (data[key] !== undefined) el.innerHTML = data[key];
        });
    }

    // --- Tab Memory & Navigation ---
    function setupTabMemory() {
        const tabButtons = document.querySelectorAll('#myTab button[data-bs-toggle="tab"]');
        tabButtons.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                if (event.target.dataset.bsTarget) {
                    localStorage.setItem('lastActiveTab', event.target.dataset.bsTarget);
                }
            });
        });

        // URL query parameter takes priority (e.g. ?tab=study)
        const urlParams = new URLSearchParams(window.location.search);
        const requestedTab = urlParams.get('tab');
        if (requestedTab) {
            const targetBtn = document.querySelector(`button[data-bs-target="#tab-${requestedTab}"]`);
            if (targetBtn) {
                new bootstrap.Tab(targetBtn).show();
                return;
            }
        }

        const lastTabId = localStorage.getItem('lastActiveTab');
        if (lastTabId) {
            try {
                const safeLastTabId = lastTabId.replace(/"/g, '\\"');
                const lastTab = document.querySelector(`button[data-bs-target="${safeLastTabId}"]`);
                if (lastTab) new bootstrap.Tab(lastTab).show();
            } catch (err) {
                console.warn("Invalid tab ID in localStorage:", err);
            }
        }
    }

    // --- Copy Helper ---
    async function copyToClipboard(text, btnElement) {
        try {
            await navigator.clipboard.writeText(text);
            const originalHTML = btnElement.innerHTML;
            btnElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>`;
            setTimeout(() => {
                btnElement.innerHTML = originalHTML;
            }, 1500);
        } catch (e) {
            console.error("Copy failed:", e);
        }
    }

    // --- Client-Side Table Generation & Inspector ---
    let currentTableSize = 24;

    function generateTablesData(tableSize = 24) {
        const header = Array.from({ length: tableSize }, (_, i) => toBijective(i + 1));
        const addition = Array.from({ length: tableSize }, (_, i) =>
            Array.from({ length: tableSize }, (_, j) => toBijective((i + 1) + (j + 1)))
        );
        const multiplication = Array.from({ length: tableSize }, (_, i) =>
            Array.from({ length: tableSize }, (_, j) => toBijective((i + 1) * (j + 1)))
        );
        return { header, addition, multiplication };
    }

    function renderMatrixTable(header, matrix, container, operator) {
        if (!container) return;
        let html = `
            <table class="bijective-matrix-table" data-op="${operator}">
                <thead>
                    <tr>
                        <th>${operator}</th>
                        ${header.map((h, colIdx) => `<th data-col="${colIdx}">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        matrix.forEach((row, rowIdx) => {
            html += `<tr><th data-row="${rowIdx}">${header[rowIdx]}</th>`;
            row.forEach((cell, colIdx) => {
                html += `<td data-row="${rowIdx}" data-col="${colIdx}" title="${header[rowIdx]} ${operator} ${header[colIdx]} = ${cell}">${cell}</td>`;
            });
            html += `</tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

        // Interactive hover & click crosshair
        const table = container.querySelector('table');
        const inspectorBadge = document.getElementById('table-inspector-badge');

        table.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('td');
            if (!cell) return;
            const r = cell.dataset.row;
            const c = cell.dataset.col;

            table.querySelectorAll('.header-highlight').forEach(el => el.classList.remove('header-highlight'));
            const rowHeader = table.querySelector(`tbody tr:nth-child(${parseInt(r) + 1}) th`);
            const colHeader = table.querySelector(`thead th:nth-child(${parseInt(c) + 2})`);
            if (rowHeader) rowHeader.classList.add('header-highlight');
            if (colHeader) colHeader.classList.add('header-highlight');

            if (inspectorBadge) {
                const decR = parseInt(r) + 1;
                const decC = parseInt(c) + 1;
                const opName = operator === '+' ? '+' : '×';
                const decResult = operator === '+' ? (decR + decC) : (decR * decC);
                inspectorBadge.textContent = `${header[r]} ${opName} ${header[c]} = ${cell.textContent}  [Dec: ${decR} ${opName} ${decC} = ${decResult}]`;
            }
        });

        table.addEventListener('mouseleave', () => {
            table.querySelectorAll('.header-highlight').forEach(el => el.classList.remove('header-highlight'));
        });
    }

    function initTablesTab() {
        const tablesTab = document.getElementById('tables-tab');
        const addContainer = document.getElementById('addition-table-container');
        const mulContainer = document.getElementById('multiplication-table-container');
        const sizeSelect = document.getElementById('table-size-select');

        let tablesLoaded = false;

        const loadTables = (size) => {
            currentTableSize = size;
            const data = generateTablesData(size);
            if (addContainer) renderMatrixTable(data.header, data.addition, addContainer, '+');
            if (mulContainer) renderMatrixTable(data.header, data.multiplication, mulContainer, '×');
            tablesLoaded = true;
        };

        if (tablesTab) {
            tablesTab.addEventListener('shown.bs.tab', () => {
                if (!tablesLoaded) {
                    loadTables(currentTableSize);
                }
            });
        }

        if (sizeSelect) {
            sizeSelect.addEventListener('change', (e) => {
                loadTables(parseInt(e.target.value, 10) || 24);
            });
        }
    }

    // --- Calculator & Converter Setup ---
    function setupCalculator() {
        const num1Input = document.getElementById('num1');
        const num2Input = document.getElementById('num2');
        const calculateAllBtn = document.getElementById('calculate-all-btn');
        const resultArea = document.getElementById('result-area');
        const opsResultsGrid = document.getElementById('ops-results-grid');
        const errorDisplay = document.getElementById('error-display');
        const decimalInput = document.getElementById('decimal-input');
        const conversionResults = document.getElementById('conversion-results');

        // Track focused input for virtual keypad
        if (num1Input) {
            num1Input.addEventListener('focus', () => { lastActiveInput = num1Input; });
            num1Input.addEventListener('input', sanitizeBijectiveInput);
        }
        if (num2Input) {
            num2Input.addEventListener('focus', () => { lastActiveInput = num2Input; });
            num2Input.addEventListener('input', sanitizeBijectiveInput);
        }
        lastActiveInput = num1Input;

        function sanitizeBijectiveInput(e) {
            const input = e.target;
            const originalVal = input.value;
            const cleanVal = originalVal.replace(/[^1-6]/g, '');
            if (cleanVal !== originalVal) {
                input.value = cleanVal;
                showInputHint(input, "Only digits 1-6 allowed in bijective base-6!");
            }
        }

        function showInputHint(input, msg) {
            let hint = input.parentElement.querySelector('.input-hint');
            if (!hint) {
                hint = document.createElement('div');
                hint.className = 'input-hint text-warning small mt-1';
                input.parentElement.appendChild(hint);
            }
            hint.textContent = msg;
            setTimeout(() => { if (hint) hint.remove(); }, 2500);
        }

        // Setup Virtual Keypad buttons
        document.querySelectorAll('.keypad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = lastActiveInput || num1Input;
                if (!target) return;
                const digit = btn.dataset.digit;
                const action = btn.dataset.action;

                if (digit) {
                    target.value += digit;
                    target.dispatchEvent(new Event('input'));
                } else if (action === 'backspace') {
                    target.value = target.value.slice(0, -1);
                    target.dispatchEvent(new Event('input'));
                } else if (action === 'clear') {
                    target.value = '';
                    target.dispatchEvent(new Event('input'));
                }
                target.focus();
            });
        });

        // Setup Preset Chips for Live Converter
        document.querySelectorAll('.preset-chips .chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                if (decimalInput) {
                    decimalInput.value = val;
                    decimalInput.dispatchEvent(new Event('input'));
                    decimalInput.focus();
                }
            });
        });

        // Live Converter Logic
        const updateConversions = () => {
            if (!decimalInput || !conversionResults) return;
            const rawVal = decimalInput.value.trim();
            const decimalValue = parseInt(rawVal, 10);

            if (!rawVal || isNaN(decimalValue) || decimalValue <= 0) {
                conversionResults.innerHTML = '';
                return;
            }

            const bijValue = toBijective(decimalValue);
            const senaryValue = decimalValue.toString(6);
            const binValue = decimalValue.toString(2);
            const hexValue = decimalValue.toString(16).toUpperCase();

            conversionResults.innerHTML = `
                <div class="result-grid">
                    <div class="conversion-card featured">
                        <div class="conversion-card-header">
                            <span class="conversion-card-label">Bijective Base-6 (1-6)</span>
                            <button class="copy-mini-btn" data-copy="${bijValue}" title="Copy" aria-label="Copy">
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                            </button>
                        </div>
                        <div class="conversion-value">${bijValue}</div>
                    </div>
                    <div class="conversion-card">
                        <div class="conversion-card-header">
                            <span class="conversion-card-label">Standard Senary (0-5)</span>
                            <button class="copy-mini-btn" data-copy="${senaryValue}" title="Copy" aria-label="Copy">
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                            </button>
                        </div>
                        <div class="conversion-value">${senaryValue}₆</div>
                    </div>
                    <div class="conversion-card">
                        <div class="conversion-card-header">
                            <span class="conversion-card-label">Decimal</span>
                            <button class="copy-mini-btn" data-copy="${decimalValue}" title="Copy" aria-label="Copy">
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                            </button>
                        </div>
                        <div class="conversion-value">${decimalValue}</div>
                    </div>
                    <div class="conversion-card">
                        <div class="conversion-card-header">
                            <span class="conversion-card-label">Binary</span>
                            <button class="copy-mini-btn" data-copy="${binValue}" title="Copy" aria-label="Copy">
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                            </button>
                        </div>
                        <div class="conversion-value">${binValue}₂</div>
                    </div>
                    <div class="conversion-card">
                        <div class="conversion-card-header">
                            <span class="conversion-card-label">Hexadecimal</span>
                            <button class="copy-mini-btn" data-copy="${hexValue}" title="Copy" aria-label="Copy">
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                            </button>
                        </div>
                        <div class="conversion-value">0x${hexValue}</div>
                    </div>
                </div>
            `;

            conversionResults.querySelectorAll('.copy-mini-btn').forEach(b => {
                b.addEventListener('click', () => copyToClipboard(b.dataset.copy, b));
            });
        };

        if (decimalInput) {
            decimalInput.addEventListener('input', updateConversions);
        }

        // Calculate All Button Logic
        if (calculateAllBtn) {
            calculateAllBtn.addEventListener('click', () => {
                try {
                    if (!num1Input || !num2Input) throw new Error("Number inputs not found.");
                    const num1 = num1Input.value.trim();
                    const num2 = num2Input.value.trim();
                    if (!num1 || !num2) throw new Error(i18nData.errorBothNumbers || "Please enter both numbers.");

                    const n1 = fromBijective(num1);
                    const n2 = fromBijective(num2);

                    const results = {
                        addition: { dec: n1 + n2, op: '+' },
                        subtraction: { dec: (n1 - n2 > 0) ? (n1 - n2) : null, op: '-', rawDiff: n1 - n2 },
                        multiplication: { dec: n1 * n2, op: '×' },
                        division: {
                            dec: n2 !== 0 ? Math.floor(n1 / n2) : null,
                            op: '÷',
                            rem: n2 !== 0 ? (n1 % n2) : null,
                            floatVal: n2 !== 0 ? (n1 / n2) : null
                        }
                    };

                    displayAllOpsResults(num1, num2, results, n1, n2);
                    if (errorDisplay) {
                        errorDisplay.textContent = '';
                        errorDisplay.classList.remove('visible');
                    }
                    if (resultArea) {
                        resultArea.style.display = 'block';
                        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } catch (e) {
                    console.warn("Calculator error:", e);
                    if (errorDisplay) {
                        errorDisplay.textContent = `${i18nData.errorGeneric || 'Error:'} ${e.message}`;
                        errorDisplay.classList.add('visible');
                    }
                    if (opsResultsGrid) opsResultsGrid.innerHTML = '';
                    if (resultArea) resultArea.style.display = 'block';
                }
            });

            const triggerCalculate = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    calculateAllBtn.click();
                }
            };
            if (num1Input) num1Input.addEventListener('keydown', triggerCalculate);
            if (num2Input) num2Input.addEventListener('keydown', triggerCalculate);
        }

        function displayAllOpsResults(num1, num2, data, n1, n2) {
            if (!opsResultsGrid) return;
            opsResultsGrid.innerHTML = Object.entries(data).map(([opName, res]) => {
                let bijectiveResult;
                let decimalDetail = '';

                if (opName === 'division') {
                    if (res.dec === null || res.dec === 0) {
                        bijectiveResult = '(N/A)';
                        decimalDetail = `Decimal: ${n1} ÷ ${n2} = ${res.floatVal.toFixed(3)}`;
                    } else if (res.rem !== 0) {
                        const qBij = toBijective(res.dec);
                        const rBij = toBijective(res.rem);
                        bijectiveResult = `${qBij} <span style="font-size: 0.85em; font-weight: normal; color: var(--text-color-muted);">(rem ${rBij})</span>`;
                        decimalDetail = `Decimal: ${n1} ÷ ${n2} = ${res.dec} rem ${res.rem} (${res.floatVal.toFixed(2)})`;
                    } else {
                        bijectiveResult = toBijective(res.dec);
                        decimalDetail = `Decimal: ${n1} ÷ ${n2} = ${res.dec}`;
                    }
                } else if (opName === 'subtraction') {
                    if (res.dec === null) {
                        bijectiveResult = '(N/A)';
                        decimalDetail = `Decimal: ${n1} - ${n2} = ${res.rawDiff} (Bijective has no zero or negative)`;
                    } else {
                        bijectiveResult = toBijective(res.dec);
                        decimalDetail = `Decimal: ${n1} - ${n2} = ${res.dec}`;
                    }
                } else if (opName === 'addition') {
                    bijectiveResult = toBijective(res.dec);
                    decimalDetail = `Decimal: ${n1} + ${n2} = ${res.dec}`;
                } else {
                    bijectiveResult = toBijective(res.dec);
                    decimalDetail = `Decimal: ${n1} × ${n2} = ${res.dec}`;
                }

                return `
                    <div class="col">
                        <div class="op-result-item h-100">
                            <div class="op-title">${opName}</div>
                            <div class="op-problem">${num1} ${res.op} ${num2}</div>
                            <div class="op-answer">${bijectiveResult}</div>
                            <div class="op-step">${decimalDetail}</div>
                        </div>
                    </div>`;
            }).join('');
        }
    }

    // --- Practice Mode ---
    function setupPracticeMode() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
        const conversionCheckbox = document.getElementById('quiz-type-conversions');
        const arithmeticCheckbox = document.getElementById('quiz-type-arithmetic');
        
        let currentQuestion = null;
        let streak = parseInt(localStorage.getItem('quizStreak') || '0', 10);
        let totalCorrect = parseInt(localStorage.getItem('quizCorrect') || '0', 10);
        let totalAnswered = parseInt(localStorage.getItem('quizTotal') || '0', 10);

        // Load saved difficulty
        const savedDifficulty = localStorage.getItem('quizDifficulty') || 'easy';
        const difficultyRadio = document.getElementById(`difficulty-${savedDifficulty}`);
        if (difficultyRadio) difficultyRadio.checked = true;

        const savedConvChecked = localStorage.getItem('quizConvChecked');
        if (conversionCheckbox && savedConvChecked !== null) {
            conversionCheckbox.checked = (savedConvChecked === 'true');
        }

        const savedArithChecked = localStorage.getItem('quizArithChecked');
        if (arithmeticCheckbox && savedArithChecked !== null) {
            arithmeticCheckbox.checked = (savedArithChecked === 'true');
        }

        const generateQuestion = () => {
            try {
                const checkedRadio = document.querySelector('input[name="difficulty"]:checked');
                const selectedDifficulty = checkedRadio ? checkedRadio.value : 'easy';
                const difficultyMap = { easy: 6, medium: 24, hard: 60 };
                const maxNum = difficultyMap[selectedDifficulty] || 6;

                const types = [];
                if (conversionCheckbox?.checked) types.push('conversion');
                if (arithmeticCheckbox?.checked) types.push('arithmetic');
                if (types.length === 0) {
                    if (conversionCheckbox) conversionCheckbox.checked = true;
                    types.push('conversion');
                }

                const type = types[Math.floor(Math.random() * types.length)];
                let questionText = '';
                let answer = '';

                if (type === 'conversion') {
                    const num = Math.floor(Math.random() * maxNum) + 1;
                    questionText = (i18nData.quizQuestionConversion || "What is {number} in bijective base-6?").replace('{number}', `<code>${num}</code>`);
                    answer = toBijective(num);
                } else {
                    const num1 = Math.floor(Math.random() * maxNum) + 1;
                    const num2 = Math.floor(Math.random() * maxNum) + 1;
                    const op = Math.random() > 0.5 ? '+' : '×';
                    questionText = (i18nData.quizQuestionArithmetic || "What is {num1} {op} {num2}?")
                        .replace('{num1}', `<code>${toBijective(num1)}</code>`)
                        .replace('{op}', op)
                        .replace('{num2}', `<code>${toBijective(num2)}</code>`);
                    answer = toBijective(op === '+' ? num1 + num2 : num1 * num2);
                }
                currentQuestion = { questionText, answer };
                renderQuizUI();
            } catch (err) {
                console.error("Error generating quiz question:", err);
            }
        };

        const renderQuizUI = () => {
            if (!container || !currentQuestion) return;
            container.innerHTML = `
                <div class="quiz-card">
                    <div class="quiz-score-banner">
                        <div class="quiz-stat">Streak: <span class="val" id="quiz-streak-val">🔥 ${streak}</span></div>
                        <div class="quiz-stat">Correct: <span class="val" id="quiz-total-val">${totalCorrect} / ${totalAnswered}</span></div>
                    </div>
                    <div class="quiz-question-box mb-4">${currentQuestion.questionText}</div>
                    <div class="input-group" style="max-width: 340px; margin: auto;">
                        <input type="tel" id="quiz-answer" class="form-control text-center fs-5" data-i18n-placeholder="quizAnswerPlaceholder" autofocus autocomplete="off">
                        <button id="quiz-submit" class="btn btn-primary" data-i18n="quizSubmitBtn">Submit</button>
                    </div>
                    <div class="keypad-container justify-content-center mt-3" style="max-width: 320px; margin: auto;">
                        <button class="keypad-btn quiz-pad-btn" data-val="1">1</button>
                        <button class="keypad-btn quiz-pad-btn" data-val="2">2</button>
                        <button class="keypad-btn quiz-pad-btn" data-val="3">3</button>
                        <button class="keypad-btn quiz-pad-btn" data-val="4">4</button>
                        <button class="keypad-btn quiz-pad-btn" data-val="5">5</button>
                        <button class="keypad-btn quiz-pad-btn" data-val="6">6</button>
                    </div>
                    <div id="quiz-feedback" class="mt-3"></div>
                </div>
            `;
            applyTranslations(i18nData);

            const answerEl = document.getElementById('quiz-answer');
            const submitBtn = document.getElementById('quiz-submit');

            if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
            if (answerEl) {
                answerEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') checkAnswer();
                });
                answerEl.focus();
            }

            container.querySelectorAll('.quiz-pad-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (answerEl) {
                        answerEl.value += btn.dataset.val;
                        answerEl.focus();
                    }
                });
            });
        };

        const checkAnswer = () => {
            try {
                const answerEl = document.getElementById('quiz-answer');
                const feedbackEl = document.getElementById('quiz-feedback');
                if (!answerEl || !feedbackEl || !currentQuestion) return;

                const userAnswer = answerEl.value.trim().toUpperCase();
                if (!userAnswer) return;

                totalAnswered++;

                if (userAnswer === currentQuestion.answer) {
                    streak++;
                    totalCorrect++;
                    localStorage.setItem('quizStreak', streak.toString());
                    localStorage.setItem('quizCorrect', totalCorrect.toString());
                    localStorage.setItem('quizTotal', totalAnswered.toString());

                    feedbackEl.innerHTML = `<div class="alert alert-success fs-5 py-2">${i18nData.quizCorrectFeedback || 'Correct! 🎉'}</div>`;
                    setTimeout(generateQuestion, 1200);
                } else {
                    streak = 0;
                    localStorage.setItem('quizStreak', '0');
                    localStorage.setItem('quizTotal', totalAnswered.toString());

                    const tmpl = i18nData.quizIncorrectFeedback || 'Not quite! The correct answer was {answer}.';
                    feedbackEl.innerHTML = `<div class="alert alert-danger py-2">${tmpl.replace('{answer}', `<strong>${currentQuestion.answer}</strong>`)}</div>`;
                    setTimeout(generateQuestion, 2400);
                }
            } catch (err) {
                console.error("Error checking quiz answer:", err);
            }
        };

        difficultyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                localStorage.setItem('quizDifficulty', e.target.value);
                generateQuestion();
            });
        });
        if (conversionCheckbox) conversionCheckbox.addEventListener('change', () => {
            localStorage.setItem('quizConvChecked', conversionCheckbox.checked);
            generateQuestion();
        });
        if (arithmeticCheckbox) arithmeticCheckbox.addEventListener('change', () => {
            localStorage.setItem('quizArithChecked', arithmeticCheckbox.checked);
            generateQuestion();
        });

        generateQuestion();
    }

    // --- Settings Modal & Theme Switcher ---
    function setupSettingsModal() {
        const themeSwitch = document.getElementById('theme-switch-modal');
        const themeLabel = document.getElementById('theme-switch-label');
        const languageList = document.getElementById('language-list-modal');

        if (!themeSwitch || !languageList) return;

        function updateThemeUI(theme) {
            themeSwitch.checked = (theme === 'dark');
            themeLabel.textContent = theme === 'dark' ? (i18nData.themeDark || 'Dark Mode') : (i18nData.themeLight || 'Light Mode');
        }

        function setTheme(theme) {
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeUI(theme);
        }

        themeSwitch.addEventListener('change', () => {
            setTheme(themeSwitch.checked ? 'dark' : 'light');
        });

        function populateLanguageList() {
            languageList.innerHTML = '';
            const currentLang = localStorage.getItem('language') || 'en';
            for (const [code, details] of Object.entries(supportedLangs)) {
                const langItem = document.createElement('a');
                langItem.href = '#';
                langItem.className = `list-group-item list-group-item-action language-option ${code === currentLang ? 'active' : ''}`;
                langItem.innerHTML = `<span class="fi fi-${details.flag} me-2"></span> <span>${details.name}</span>`;
                langItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    setLanguage(code).then(() => {
                        populateLanguageList();
                        updateThemeUI(localStorage.getItem('theme') || 'dark');
                    });
                });
                languageList.appendChild(langItem);
            }
        }

        const initialTheme = localStorage.getItem('theme') || 'dark';
        setTheme(initialTheme);
        populateLanguageList();
    }

    // --- Initial Startup ---
    setupSettingsModal();
    setupTabMemory();
    setupCalculator();
    setupPracticeMode();
    initTablesTab();

    // Check URL parameter for initial language
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const initialLang = langParam || localStorage.getItem('language') || 'en';
    setLanguage(initialLang);
});
