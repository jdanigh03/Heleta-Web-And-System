/* ===== HELETA SMART SEARCH + CATALOG LOGIC ===== */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const cards = Array.from(document.querySelectorAll('.catalogo__card'));
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.catalogo__filter-btn');
    const tags = document.querySelectorAll('.catalogo__tag');
    const sortSelect = document.getElementById('sort-select');
    const viewBtns = document.querySelectorAll('.catalogo__view-btn');

    let filters = {
        search: '',
        sabor: 'todos',
        tamano: 'todos',
        especial: []
    };

    // ==============================
    // BUILD SEARCHABLE DATA
    // ==============================
    const productData = cards.map(card => ({
        el: card,
        name: card.dataset.name || '',
        sabor: card.dataset.sabor || '',
        tamano: card.dataset.tamano || '',
        especial: card.dataset.especial || '',
        price: parseInt(card.dataset.price) || 0,
        // Also grab description and flavor spans from DOM
        desc: card.querySelector('.catalogo__card-desc')?.textContent || '',
        flavors: Array.from(card.querySelectorAll('.catalogo__flavor')).map(f => f.textContent).join(' ')
    }));

    // ==============================
    // SMART SEARCH AUTOCOMPLETE
    // ==============================
    let dropdown = null;

    function createDropdown() {
        dropdown = document.createElement('div');
        dropdown.id = 'search-dropdown';
        dropdown.className = 'search-dropdown';
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(dropdown);
    }

    function showSuggestions(query) {
        if (!dropdown) createDropdown();
        if (!query || query.length < 1) {
            dropdown.style.display = 'none';
            return;
        }

        const q = query.toLowerCase();
        const matches = productData.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.flavors.toLowerCase().includes(q) ||
            p.sabor.toLowerCase().includes(q) ||
            p.especial.toLowerCase().includes(q)
        ).slice(0, 5);

        if (matches.length === 0) {
            dropdown.innerHTML = `<div class="search-dropdown__item search-dropdown__item--none">
                😕 Sin resultados para "<b>${query}</b>"
            </div>`;
        } else {
            dropdown.innerHTML = matches.map(p => {
                const imgSrc = p.el.querySelector('img')?.src || '';
                const highlighted = highlightText(p.name, query);
                return `<div class="search-dropdown__item" data-name="${p.name}">
                    <img src="${imgSrc}" alt="${p.name}" class="search-dropdown__img">
                    <div class="search-dropdown__info">
                        <span class="search-dropdown__name">${highlighted}</span>
                        <span class="search-dropdown__price">Bs ${p.price}</span>
                    </div>
                </div>`;
            }).join('');

            // Click on suggestion
            dropdown.querySelectorAll('.search-dropdown__item[data-name]').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.dataset.name;
                    filters.search = item.dataset.name;
                    dropdown.style.display = 'none';
                    applyFilters();
                });
            });
        }

        dropdown.style.display = 'block';
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // ==============================
    // NO-RESULTS STATE
    // ==============================
    function showNoResults(query) {
        let noResults = document.getElementById('no-results');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'catalogo__no-results';
            grid.parentElement.insertBefore(noResults, grid.nextSibling);
        }
        noResults.innerHTML = `
            <div class="catalogo__no-results-icon">🔍</div>
            <h3>Sin resultados para "<em>${query}</em>"</h3>
            <p>Prueba buscando: chocolate, nutella, sin gluten, chai...</p>
            <div class="catalogo__no-results-suggestions">
                <button onclick="clearSearch()">Ver todas las galletas</button>
            </div>
        `;
        noResults.style.display = 'block';
        grid.style.display = 'none';
    }

    function hideNoResults() {
        const noResults = document.getElementById('no-results');
        if (noResults) noResults.style.display = 'none';
        grid.style.display = 'grid';
    }

    window.clearSearch = () => {
        searchInput.value = '';
        filters.search = '';
        applyFilters();
        searchInput.focus();
    };

    // ==============================
    // FILTER + DISPLAY LOGIC
    // ==============================
    function applyFilters() {
        const q = filters.search.toLowerCase();
        let visibleCount = 0;

        productData.forEach(p => {
            const matchesSearch = !q ||
                p.name.toLowerCase().includes(q) ||
                p.desc.toLowerCase().includes(q) ||
                p.flavors.toLowerCase().includes(q) ||
                p.sabor.toLowerCase().includes(q) ||
                p.especial.toLowerCase().includes(q);

            const matchesSabor = filters.sabor === 'todos' || p.sabor === filters.sabor;
            const matchesTamano = filters.tamano === 'todos' || p.tamano === filters.tamano;
            const matchesEspecial = filters.especial.length === 0 ||
                filters.especial.every(e => p.especial.includes(e));

            const visible = matchesSearch && matchesSabor && matchesTamano && matchesEspecial;

            if (visible) {
                p.el.style.display = 'flex';
                p.el.style.animation = 'fadeInUp 0.35s ease forwards';
                visibleCount++;

                // Highlight matching text in name
                const nameEl = p.el.querySelector('.catalogo__card-name');
                if (nameEl) {
                    nameEl.innerHTML = q ? highlightText(p.name, filters.search) : p.name;
                }
            } else {
                p.el.style.display = 'none';
            }
        });

        // Show/hide no-results state
        if (visibleCount === 0 && filters.search) {
            showNoResults(filters.search);
        } else {
            hideNoResults();
        }

        // Update result count
        updateResultCount(visibleCount);
    }

    function updateResultCount(count) {
        let counter = document.getElementById('result-count');
        if (!counter) {
            counter = document.createElement('span');
            counter.id = 'result-count';
            counter.className = 'catalogo__result-count';
            const toolbar = document.querySelector('.catalogo__toolbar');
            if (toolbar) toolbar.appendChild(counter);
        }
        if (filters.search || filters.sabor !== 'todos' || filters.tamano !== 'todos' || filters.especial.length > 0) {
            counter.textContent = `${count} resultado${count !== 1 ? 's' : ''}`;
            counter.style.display = 'inline-block';
        } else {
            counter.style.display = 'none';
        }
    }

    // ==============================
    // EVENTS
    // ==============================

    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const val = e.target.value;
        searchTimeout = setTimeout(() => {
            filters.search = val;
            showSuggestions(val);
            applyFilters();
        }, 200);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown && (dropdown.style.display = 'none');
            searchInput.blur();
        }
        if (e.key === 'Enter') {
            dropdown && (dropdown.style.display = 'none');
            applyFilters();
        }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (dropdown && !searchInput.parentElement.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.filter;
            const value = btn.dataset.value;
            document.querySelectorAll(`.catalogo__filter-btn[data-filter="${group}"]`)
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filters[group] = value;
            applyFilters();
        });
    });

    // Tags
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const value = tag.dataset.value;
            tag.classList.toggle('active');
            if (tag.classList.contains('active')) {
                filters.especial.push(value);
            } else {
                filters.especial = filters.especial.filter(v => v !== value);
            }
            applyFilters();
        });
    });

    // Sorting
    sortSelect.addEventListener('change', () => {
        const val = sortSelect.value;
        const sorted = [...productData].sort((a, b) => {
            if (val === 'price-low') return a.price - b.price;
            if (val === 'price-high') return b.price - a.price;
            if (val === 'popular') return b.especial.includes('mas-vendida') ? 1 : -1;
            return 0;
        });
        grid.innerHTML = '';
        sorted.forEach(p => grid.appendChild(p.el));
    });

    // View Toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            grid.classList.toggle('list-view', view === 'list');
        });
    });
});

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    mark {
        background: #fff3cd;
        color: inherit;
        border-radius: 2px;
        padding: 0 1px;
    }
`;
document.head.appendChild(style);
