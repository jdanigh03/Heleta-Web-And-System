/* ===== HELETA SMART SUGGESTIONS ===== */

const HelSuggestions = {
    historyKey: 'heleta_purchase_history',

    // Full product catalog (mirrors catalogo.html)
    catalog: [
        { id: 1, name: 'Chocolate Chip Clásica', price: 15, sabor: 'chocolate', img: '/static/img/cookie_chocolate.png' },
        { id: 2, name: 'Red Velvet', price: 18, sabor: 'frutas', img: '/static/img/cookie_hero.png' },
        { id: 3, name: 'Chai Especial', price: 18, sabor: 'especias', img: '/static/img/cookie_chai.png' },
        { id: 4, name: 'Matcha & White Choc', price: 20, sabor: 'chocolate', img: '/static/img/cookie_hero.png' },
        { id: 5, name: 'Avena y Pasas', price: 12, sabor: 'frutas', img: '/static/img/cookie_chai.png' },
        { id: 6, name: 'Nutella Bomb', price: 22, sabor: 'rellenas', img: '/static/img/cookie_chocolate.png' },
        { id: 7, name: 'Pack Media Docena Chocolate', price: 75, sabor: 'chocolate', img: '/static/img/cookie_pack.png' },
        { id: 8, name: 'Pack Docena Surtida', price: 130, sabor: 'rellenas', img: '/static/img/cookie_pack.png' },
    ],

    saborLabels: {
        chocolate: '🍫 Chocolate',
        frutas: '🍓 Frutas',
        especias: '🌶️ Especias',
        rellenas: '🥜 Rellenas',
    },

    getHistory() {
        return JSON.parse(localStorage.getItem(this.historyKey) || '[]');
    },

    getFavoriteSabor() {
        const history = this.getHistory();
        if (history.length === 0) return null;

        // Count sabor frequency
        const counts = {};
        history.forEach(item => {
            if (item.sabor) {
                counts[item.sabor] = (counts[item.sabor] || 0) + 1;
            }
        });

        // Find most frequent
        let maxSabor = null;
        let maxCount = 0;
        for (const [sabor, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                maxSabor = sabor;
            }
        }

        return maxSabor;
    },

    getRecommendations() {
        const favSabor = this.getFavoriteSabor();
        if (!favSabor) return [];

        const history = this.getHistory();
        const purchasedIds = new Set(history.map(h => h.id));

        // First: products of same sabor not purchased
        let recs = this.catalog.filter(p => p.sabor === favSabor && !purchasedIds.has(p.id));

        // If not enough, add same sabor already purchased
        if (recs.length < 3) {
            const alreadyBought = this.catalog.filter(p => p.sabor === favSabor && purchasedIds.has(p.id));
            recs = [...recs, ...alreadyBought];
        }

        // If still not enough, add from other sabores
        if (recs.length < 3) {
            const others = this.catalog.filter(p => p.sabor !== favSabor && !recs.find(r => r.id === p.id));
            recs = [...recs, ...others];
        }

        return recs.slice(0, 3);
    },

    render() {
        const container = document.getElementById('smart-suggestions');
        if (!container) return;

        const history = this.getHistory();
        if (history.length === 0) return; // No history, don't show

        const favSabor = this.getFavoriteSabor();
        const recs = this.getRecommendations();
        if (recs.length === 0) return;

        const saborLabel = this.saborLabels[favSabor] || favSabor;
        const matchPercents = ['95%', '88%', '82%'];

        container.innerHTML = `
            <section class="smart-suggestions">
                <div class="container">
                    <div class="smart-suggestions__banner">
                        ¡Hola de nuevo! 👋 Vimos que te encanta el <strong>${saborLabel}</strong>. ¡Tenemos algo perfecto para ti!
                    </div>

                    <div class="smart-suggestions__header">
                        <div class="smart-suggestions__badge">✨ Para Ti</div>
                        <h2 class="smart-suggestions__title">Basado en tus Gustos</h2>
                        <p class="smart-suggestions__subtitle">Seleccionamos estas galletas especialmente para ti 🍪</p>
                    </div>

                    <div class="smart-suggestions__grid">
                        ${recs.map((rec, i) => `
                            <div class="smart-suggestions__card">
                                <img class="smart-suggestions__card-img" src="${rec.img}" alt="${rec.name}">
                                <div class="smart-suggestions__card-body">
                                    <span class="smart-suggestions__card-match">${matchPercents[i]} match</span>
                                    <h4 class="smart-suggestions__card-name">${rec.name}</h4>
                                    <span class="smart-suggestions__card-price">Bs ${rec.price}</span>
                                    <button class="smart-suggestions__card-btn"
                                        onclick="HelCart.add({id:${rec.id}, name:'${rec.name.replace(/'/g, "\\'")}', price:${rec.price}, img:'${rec.img}'}, this)">
                                        <i class="fa-solid fa-cart-plus"></i> Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }
};

// Auto-render on page load
document.addEventListener('DOMContentLoaded', () => {
    HelSuggestions.render();
});
