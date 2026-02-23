/* ===== HELETA STOCK SYSTEM ===== */

const HelStock = {
    key: 'heleta_stock',
    resetKey: 'heleta_stock_reset',
    historyKey: 'heleta_purchase_history',

    // Default stock levels per product
    defaults: {
        1: { name: 'Chocolate Chip Clásica', stock: 18, max: 20, sabor: 'chocolate' },
        2: { name: 'Red Velvet', stock: 8, max: 12, sabor: 'frutas' },
        3: { name: 'Chai Especial', stock: 5, max: 10, sabor: 'especias' },
        4: { name: 'Matcha & White Choc', stock: 14, max: 15, sabor: 'chocolate' },
        5: { name: 'Avena y Pasas', stock: 20, max: 20, sabor: 'frutas' },
        6: { name: 'Nutella Bomb', stock: 3, max: 10, sabor: 'rellenas' },
        7: { name: 'Pack Media Docena Chocolate', stock: 7, max: 8, sabor: 'chocolate' },
        8: { name: 'Pack Docena Surtida', stock: 4, max: 6, sabor: 'rellenas' },
    },

    init() {
        this.checkReset();
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify(this.defaults));
        }
        if (!localStorage.getItem(this.historyKey)) {
            localStorage.setItem(this.historyKey, JSON.stringify([]));
        }
        this.renderAllStockBars();
    },

    checkReset() {
        const lastReset = localStorage.getItem(this.resetKey);
        const now = new Date();
        const today = now.toDateString();

        if (lastReset !== today) {
            // Reset stock daily
            localStorage.setItem(this.key, JSON.stringify(this.defaults));
            localStorage.setItem(this.resetKey, today);
        }
    },

    getAll() {
        return JSON.parse(localStorage.getItem(this.key) || '{}');
    },

    getStock(id) {
        const all = this.getAll();
        return all[id] ? all[id].stock : 0;
    },

    getMax(id) {
        const all = this.getAll();
        return all[id] ? all[id].max : 1;
    },

    isAvailable(id) {
        return this.getStock(id) > 0;
    },

    decrease(id) {
        const all = this.getAll();
        if (all[id] && all[id].stock > 0) {
            all[id].stock--;
            localStorage.setItem(this.key, JSON.stringify(all));
            this.updateStockBar(id);
            this.recordPurchase(id, all[id]);
            return true;
        }
        return false;
    },

    recordPurchase(id, product) {
        const history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
        history.push({
            id: id,
            name: product.name,
            sabor: product.sabor,
            timestamp: Date.now()
        });
        // Keep last 50 purchases
        if (history.length > 50) history.shift();
        localStorage.setItem(this.historyKey, JSON.stringify(history));
    },

    getLevel(stock, max) {
        const percent = (stock / max) * 100;
        if (percent > 50) return 'high';
        if (percent > 20) return 'medium';
        return 'low';
    },

    getStockLabel(stock) {
        if (stock === 0) return 'Agotado';
        if (stock <= 3) return `¡Solo quedan ${stock}!`;
        if (stock <= 8) return `Quedan ${stock}`;
        return `${stock} disponibles`;
    },

    renderAllStockBars() {
        const cards = document.querySelectorAll('.catalogo__card');
        cards.forEach(card => {
            const id = parseInt(card.dataset.id);
            if (!id) return;

            // Don't add duplicates
            if (card.querySelector('.catalogo__stock')) return;

            const stock = this.getStock(id);
            const max = this.getMax(id);
            const level = this.getLevel(stock, max);
            const percent = Math.round((stock / max) * 100);

            const stockHTML = `
                <div class="catalogo__stock" data-product-id="${id}">
                    <div class="catalogo__stock-bar">
                        <div class="catalogo__stock-fill" data-level="${level}" style="width: ${percent}%"></div>
                    </div>
                    <span class="catalogo__stock-text" data-level="${level}">${this.getStockLabel(stock)}</span>
                </div>
            `;

            const bottomEl = card.querySelector('.catalogo__card-bottom');
            if (bottomEl) {
                bottomEl.insertAdjacentHTML('beforebegin', stockHTML);
            }

            // Mark as sold out
            if (stock === 0) {
                card.classList.add('sold-out');
            }
        });
    },

    updateStockBar(id) {
        const stockEl = document.querySelector(`.catalogo__stock[data-product-id="${id}"]`);
        if (!stockEl) return;

        const stock = this.getStock(id);
        const max = this.getMax(id);
        const level = this.getLevel(stock, max);
        const percent = Math.round((stock / max) * 100);

        const fill = stockEl.querySelector('.catalogo__stock-fill');
        const text = stockEl.querySelector('.catalogo__stock-text');

        if (fill) {
            fill.style.width = `${percent}%`;
            fill.dataset.level = level;
        }
        if (text) {
            text.textContent = this.getStockLabel(stock);
            text.dataset.level = level;
        }

        // Mark sold out
        if (stock === 0) {
            const card = stockEl.closest('.catalogo__card');
            if (card) card.classList.add('sold-out');
        }
    },

    // ========== Fly-to-Cart Animation ==========
    flyToCart(buttonEl, imgSrc) {
        const imgEl = buttonEl.closest('.catalogo__card')?.querySelector('.catalogo__card-img img')
            || buttonEl.closest('.producto__content')?.querySelector('#product-image');

        if (!imgEl) return;

        const cartIcon = document.querySelector('#nav-cart') || document.querySelector('.nav__cart');
        if (!cartIcon) return;

        const imgRect = imgEl.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // Create flying element
        const flyEl = document.createElement('div');
        flyEl.className = 'fly-item';
        flyEl.innerHTML = `<img src="${imgSrc || imgEl.src}" alt="fly">`;
        flyEl.style.left = `${imgRect.left + imgRect.width / 2 - 30}px`;
        flyEl.style.top = `${imgRect.top + imgRect.height / 2 - 30}px`;
        document.body.appendChild(flyEl);

        // Trigger fly animation
        requestAnimationFrame(() => {
            flyEl.classList.add('flying');
            flyEl.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
            flyEl.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
        });

        // Create burst particles
        this.createBurst(imgRect.left + imgRect.width / 2, imgRect.top + imgRect.height / 2);

        // Bounce cart badge
        setTimeout(() => {
            const badge = document.querySelector('#cart-badge');
            if (badge) {
                badge.classList.add('bounce');
                setTimeout(() => badge.classList.remove('bounce'), 500);
            }
        }, 700);

        // Remove flying element
        setTimeout(() => flyEl.remove(), 800);
    },

    createBurst(x, y) {
        const burst = document.createElement('div');
        burst.className = 'purchase-burst';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;

        const emojis = ['🍪', '✨', '⭐', '💫', '🎉'];
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('span');
            particle.className = 'purchase-particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            const angle = (Math.PI * 2 * i) / 6;
            const dist = 40 + Math.random() * 30;
            particle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            burst.appendChild(particle);
        }

        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
    }
};

// ========== Override HelCart.add for stock integration ==========
document.addEventListener('DOMContentLoaded', () => {
    HelStock.init();

    // Store original add function
    const originalAdd = HelCart.add.bind(HelCart);

    // Override with stock-aware version
    HelCart.add = function (product, buttonEl) {
        const id = product.id;

        // Check stock
        if (!HelStock.isAvailable(id)) {
            HelCart.notify('¡Este producto está agotado! 😢');
            return;
        }

        // Decrease stock
        HelStock.decrease(id);

        // Fly animation
        if (buttonEl) {
            HelStock.flyToCart(buttonEl, product.img);

            // Button success state
            const originalHTML = buttonEl.innerHTML;
            buttonEl.classList.add('added');
            buttonEl.innerHTML = '<i class="fa-solid fa-check"></i> ¡Listo!';
            setTimeout(() => {
                buttonEl.classList.remove('added');
                buttonEl.innerHTML = originalHTML;
            }, 1500);
        }

        // Call original add
        originalAdd(product);
    };
});
