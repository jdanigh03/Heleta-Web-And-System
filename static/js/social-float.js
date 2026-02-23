/* ===== SOCIAL FLOAT + LIVE ACTIVITY ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Floating WhatsApp Button ==========
    const whatsappHTML = `
        <a href="https://wa.me/59178822909" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="Contactar por WhatsApp">
            <span class="whatsapp-float__label">¡Hola! ¿Te ayudamos? 💬</span>
            <div class="whatsapp-float__btn">
                <i class="fa-brands fa-whatsapp"></i>
            </div>
        </a>
    `;
    document.body.insertAdjacentHTML('beforeend', whatsappHTML);

    // ========== Live Activity Bar ==========
    const activities = [
        { name: 'María', city: 'Santa Cruz', product: 'Chocolate Chip Clásica', emoji: '🍪' },
        { name: 'Carlos', city: 'La Paz', product: 'Nutella Bomb', emoji: '🔥' },
        { name: 'Ana', city: 'Cochabamba', product: 'Pack Docena Surtida', emoji: '📦' },
        { name: 'José', city: 'Sucre', product: 'Chai Especial', emoji: '☕' },
        { name: 'Lucía', city: 'El Alto', product: 'Red Velvet', emoji: '❤️' },
        { name: 'Diego', city: 'Santa Cruz', product: 'Matcha & White Choc', emoji: '🍵' },
        { name: 'Sofía', city: 'Tarija', product: 'Avena y Pasas', emoji: '🌾' },
        { name: 'Pedro', city: 'Oruro', product: 'Pack Media Docena', emoji: '🎁' },
    ];

    const actions = [
        (a) => `<strong>${a.name}</strong> de ${a.city} compró <strong>${a.product}</strong> ${a.emoji}`,
        (a) => `<strong>${a.name}</strong> acaba de añadir <strong>${a.product}</strong> al carrito ${a.emoji}`,
        (a) => `⭐ <strong>${a.name}</strong> dejó 5 estrellas en <strong>${a.product}</strong>`,
    ];

    // Create live activity bar element
    const activityBar = document.createElement('div');
    activityBar.className = 'live-activity';
    activityBar.innerHTML = `
        <span class="live-activity__dot"></span>
        <span class="live-activity__text"></span>
        <button class="live-activity__close" aria-label="Cerrar">&times;</button>
    `;
    document.body.appendChild(activityBar);

    const activityText = activityBar.querySelector('.live-activity__text');
    const closeBtn = activityBar.querySelector('.live-activity__close');
    let activityInterval;
    let dismissed = false;

    closeBtn.addEventListener('click', () => {
        activityBar.classList.remove('visible');
        dismissed = true;
        clearInterval(activityInterval);
    });

    function showActivity() {
        if (dismissed) return;

        const activity = activities[Math.floor(Math.random() * activities.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        activityText.innerHTML = action(activity);

        activityBar.classList.add('visible');

        // Hide after 5 seconds
        setTimeout(() => {
            if (!dismissed) {
                activityBar.classList.remove('visible');
            }
        }, 5000);
    }

    // First activity after 4 seconds
    setTimeout(() => {
        showActivity();
        // Then every 12 seconds
        activityInterval = setInterval(showActivity, 12000);
    }, 4000);
});
