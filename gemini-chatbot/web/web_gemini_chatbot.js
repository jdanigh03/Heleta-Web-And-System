document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    const appendMessage = (sender, message) => {
        const messageElement = document.createElement('p');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'gemini-message');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    };

    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            appendMessage('user', `Tú: ${message}`);
            userInput.value = '';

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: message }),
                });
                const data = await response.json();
                appendMessage('gemini', `Gemini: ${data.response}`);
            } catch (error) {
                appendMessage('gemini', `Gemini: Error al comunicarse con el servidor: ${error.message}`);
            }
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
