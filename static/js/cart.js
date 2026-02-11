/* ===== HELETA CART LOGIC ===== */

const HelCart = {
    key: 'heleta_cart',

    init() {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify([]));
        }
        this.updateBadge();
    },

    getItems() {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
    },

    setItems(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateBadge();
    },

    add(product) {
        const items = this.getItems();
        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            addedAt: new Date().getTime()
        });
        this.setItems(items);
        this.notify(`¡${product.name} añadida al carrito! 🍪`);
    },

    removeOne(id) {
        const items = this.getItems();
        const index = items.findLastIndex(item => item.id === id);
        if (index > -1) {
            items.splice(index, 1);
            this.setItems(items);
        }
    },

    removeAll(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        this.setItems(items);
    },

    clear() {
        this.setItems([]);
    },

    getTotal() {
        const items = this.getItems();
        return items.reduce((total, item) => total + item.price, 0);
    },

    getCount() {
        return this.getItems().length;
    },

    updateBadge() {
        const badges = document.querySelectorAll('#cart-badge');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    notify(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<i class="fa-solid fa-cookie-bite"></i> ${message}`;
        document.body.appendChild(notification);

        // Styling via JS to avoid extra CSS file if small
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--primary)',
            color: '#fff',
            padding: '1rem 2rem',
            borderRadius: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: '1000',
            transition: 'all 0.4s ease',
            transform: 'translateY(100px)',
            opacity: '0'
        });

        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
};

// Auto-init
HelCart.init();
