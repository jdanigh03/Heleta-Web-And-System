/* ===== CATALOGO LOGIC ===== */

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

    function updateDisplay() {
        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const sabor = card.dataset.sabor;
            const tamano = card.dataset.tamano;
            const especial = card.dataset.especial;

            const matchesSearch = name.includes(filters.search.toLowerCase());
            const matchesSabor = filters.sabor === 'todos' || sabor === filters.sabor;
            const matchesTamano = filters.tamano === 'todos' || tamano === filters.tamano;
            const matchesEspecial = filters.especial.length === 0 || filters.especial.every(e => especial.includes(e));

            if (matchesSearch && matchesSabor && matchesTamano && matchesEspecial) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Search
    searchInput.addEventListener('input', (e) => {
        filters.search = e.target.value;
        updateDisplay();
    });

    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.filter;
            const value = btn.dataset.value;

            // Update UI
            document.querySelectorAll(`.catalogo__filter-btn[data-filter="${group}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            filters[group] = value;
            updateDisplay();
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
            updateDisplay();
        });
    });

    // Sorting
    sortSelect.addEventListener('change', () => {
        const val = sortSelect.value;
        const sorted = [...cards].sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);

            if (val === 'price-low') return priceA - priceB;
            if (val === 'price-high') return priceB - priceA;
            if (val === 'popular') return b.dataset.especial.includes('mas-vendida') ? 1 : -1;
            return 0;
        });

        grid.innerHTML = '';
        sorted.forEach(card => grid.appendChild(card));
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

// Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
