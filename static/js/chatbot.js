/**
 * Heleta Support Chatbot - Powered by Gemini AI
 */
const HelChat = (() => {
    let chatbotWindow, toggleBtn, messagesContainer, chatInput, sendBtn, optionsBar;
    let conversationHistory = []; // Track conversation for AI context

    const init = () => {
        if (!document.querySelector('.hel-chatbot')) {
            createChatbotHTML();
        }

        chatbotWindow = document.getElementById('helChatWindow');
        toggleBtn = document.getElementById('helChatToggle');
        messagesContainer = document.getElementById('helChatMessages');
        chatInput = document.getElementById('helChatInput');
        sendBtn = document.getElementById('helChatSend');
        optionsBar = document.getElementById('helChatOptions');

        toggleBtn.addEventListener('click', toggleChat);
        document.getElementById('helChatClose').addEventListener('click', toggleChat);

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Quick option buttons
        optionsBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.hel-chatbot__opt-btn');
            if (btn) {
                const query = btn.getAttribute('data-query');
                chatInput.value = query;
                sendMessage();
            }
        });
    };

    const createChatbotHTML = () => {
        const html = `
        <div class="hel-chatbot">
            <button class="hel-chatbot__toggle" id="helChatToggle" title="Chat con Hela">
                <i class="fa-solid fa-comment-dots"></i>
            </button>
            <div class="hel-chatbot__window" id="helChatWindow">
                <div class="hel-chatbot__header">
                    <h3>🍪 Hela - Asistente</h3>
                    <button class="hel-chatbot__close" id="helChatClose">&times;</button>
                </div>
                <div class="hel-chatbot__messages" id="helChatMessages">
                    <div class="hel-message hel-message--bot">
                        ¡Hola! 👋 Soy <b>Hela</b>, tu asistente de Heleta.<br>
                        Puedo ayudarte con sugerencias de galletas o problemas con pedidos. ¿Qué necesitas?
                    </div>
                </div>
                <div class="hel-chatbot__options" id="helChatOptions">
                    <button class="hel-chatbot__opt-btn" data-query="¿Qué galletas me recomiendas?">🍪 Sugerencias</button>
                    <button class="hel-chatbot__opt-btn" data-query="Tengo un problema con mi pedido">📦 Problema</button>
                    <button class="hel-chatbot__opt-btn" data-query="¿Cuáles son los precios?">💰 Precios</button>
                    <button class="hel-chatbot__opt-btn" data-query="¿Dónde están sus sucursales?">📍 Sucursales</button>
                </div>
                <div class="hel-chatbot__input-area">
                    <input type="text" class="hel-chatbot__input" id="helChatInput" placeholder="Pregúntame lo que quieras...">
                    <button class="hel-chatbot__send" id="helChatSend">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    };

    const toggleChat = () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    };

    const addMessage = (text, type = 'bot') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `hel-message hel-message--${type}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    };

    const addTyping = () => {
        const typing = document.createElement('div');
        typing.className = 'hel-message hel-message--bot hel-typing';
        typing.id = 'helTyping';
        typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const removeTyping = () => {
        const el = document.getElementById('helTyping');
        if (el) el.remove();
    };

    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        addTyping();

        // Add user message to history
        conversationHistory.push({ role: 'user', text: text });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: conversationHistory.slice(-10) // Send last 10 messages for context
                })
            });
            removeTyping();

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();
            addMessage(data.reply, 'bot');

            // Add bot reply to history
            conversationHistory.push({ role: 'bot', text: data.reply });

            // If server says show ticket form
            if (data.form === 'ticket') {
                showTicketForm();
            }
        } catch (error) {
            removeTyping();
            console.error('Chat error:', error);
            addMessage('⚠️ Error de conexión. Intenta de nuevo.', 'bot');
        }
    };

    const showTicketForm = () => {
        const formHtml = `
            <div class="hel-ticket-form" id="helTicketForm">
                <label><small><b>Tu Nombre *</b></small></label>
                <input type="text" id="tkName" placeholder="Ej: María López">
                <label><small><b>Tu Email *</b></small></label>
                <input type="email" id="tkEmail" placeholder="Ej: maria@email.com">
                <label><small><b>N° de Pedido</b></small></label>
                <input type="text" id="tkOrderId" placeholder="Ej: HEL-00123 (opcional)">
                <label><small><b>Describe el problema *</b></small></label>
                <textarea id="tkMsg" placeholder="Cuéntanos qué sucedió..." rows="3"></textarea>
                <button class="hel-ticket-submit" onclick="HelChat.submitTicket()">
                    <i class="fa-solid fa-paper-plane"></i> Enviar Ticket
                </button>
            </div>`;
        addMessage(formHtml, 'bot');
    };

    const submitTicket = async () => {
        const name = document.getElementById('tkName').value.trim();
        const email = document.getElementById('tkEmail').value.trim();
        const order_id = document.getElementById('tkOrderId').value.trim();
        const detail = document.getElementById('tkMsg').value.trim();

        if (!name) { alert('Ingresa tu nombre.'); return; }
        if (!email || !email.includes('@')) { alert('Ingresa un email válido.'); return; }
        if (!detail) { alert('Describe el problema.'); return; }

        const btn = document.querySelector('#helTicketForm .hel-ticket-submit');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket: true,
                    name, email, order_id, detail,
                    issue_type: 'problema_pedido'
                })
            });

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();
            const form = document.getElementById('helTicketForm');
            if (form) form.closest('.hel-message').remove();
            addMessage(data.reply, 'bot');
        } catch (error) {
            console.error('Ticket error:', error);
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Ticket';
            addMessage('⚠️ Error al enviar. Intenta de nuevo.', 'bot');
        }
    };

    return { init, submitTicket };
})();

document.addEventListener('DOMContentLoaded', HelChat.init);
