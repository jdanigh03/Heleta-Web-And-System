# Guía de Integración de Chatbot con Gemini 2.5 Pro

## 1. Introducción a Gemini 2.5 Pro

Gemini 2.5 Pro es uno de los modelos de lenguaje más avanzados de Google AI, diseñado para manejar tareas complejas de razonamiento y comprensión. Se destaca por su capacidad multimodal, lo que significa que puede procesar y generar contenido a partir de texto, imágenes, audio y video. Su ventana de contexto ampliada permite interacciones más largas y coherentes, lo que lo hace ideal para construir chatbots sofisticados y aplicaciones conversacionales.

### ¿Por qué usar Gemini 2.5 Pro para un Chatbot?

*   **Razonamiento Avanzado:** Capacidad para entender y responder a preguntas complejas, realizar análisis y planificar. 
*   **Multimodalidad:** Permite a los chatbots interactuar con los usuarios a través de diferentes tipos de datos, enriqueciendo la experiencia. 
*   **Contexto Amplio:** Mantiene el hilo de la conversación durante más tiempo, lo que resulta en interacciones más naturales y fluidas. 
*   **Flexibilidad:** Se integra fácilmente en diversas plataformas y lenguajes de programación.

## 2. Requisitos Previos

Para integrar un chatbot con Gemini 2.5 Pro, necesitarás lo siguiente:

### 2.1. Obtener una API Key

La clave de API es esencial para autenticar tus solicitudes a la API de Gemini. Puedes obtener una clave de API gratuita en [Google AI Studio](https://aistudio.google.com/) [1].

Una vez que tengas tu clave, es una buena práctica de seguridad establecerla como una variable de entorno en tu sistema. Esto evita que la clave se exponga directamente en tu código fuente. Por ejemplo, en sistemas basados en Unix/Linux, puedes usar:

```bash
export GEMINI_API_KEY=\'TU_API_KEY_AQUI\'
```

O, si estás utilizando un archivo `.env` para la gestión de variables de entorno (común en proyectos Node.js):

```
GEMINI_API_KEY=TU_API_KEY_AQUI
```

## 3. Integración con Python

Python es un lenguaje popular para el desarrollo de aplicaciones de IA debido a su ecosistema robusto y facilidad de uso. Google proporciona un SDK oficial para Python que simplifica la interacción con la API de Gemini.

### 3.1. Instalación del SDK

Instala el paquete `google-genai` usando `pip`:

```bash
pip install -q -U google-genai
```

### 3.2. Código de Ejemplo (Python)

Este script de Python demuestra cómo crear un chatbot básico que interactúa con el modelo Gemini 2.5 Pro. El chatbot toma la entrada del usuario y devuelve la respuesta generada por Gemini.

```python
import os
from google import genai

# Configura tu API Key de Gemini
# Es altamente recomendable establecer GEMINI_API_KEY como una variable de entorno
# export GEMINI_API_KEY=\'TU_API_KEY_AQUI\'

# Inicializa el cliente de Gemini
# El cliente buscará automáticamente la API Key en la variable de entorno GEMINI_API_KEY
try:
    client = genai.Client()
except Exception as e:
    print(f"Error al inicializar el cliente de Gemini: {e}")
    print("Asegúrate de que la variable de entorno GEMINI_API_KEY esté configurada correctamente.")
    exit()

def get_gemini_response(prompt):
    """
    Envía un prompt al modelo Gemini 2.5 Pro y devuelve la respuesta.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-pro", 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error al obtener respuesta de Gemini: {e}"

def main():
    print("¡Bienvenido al Chatbot de Gemini 2.5 Pro!")
    print("Escribe \'salir\' para terminar la conversación.")

    while True:
        user_input = input("Tú: ")
        if user_input.lower() == \'salir\':
            break
        
        gemini_response = get_gemini_response(user_input)
        print(f"Gemini: {gemini_response}")

if __name__ == "__main__":
    main()
```

### 3.3. Cómo Ejecutarlo

1.  Guarda el código anterior como `python_gemini_chatbot.py`.
2.  Asegúrate de haber configurado tu `GEMINI_API_KEY` como variable de entorno.
3.  Ejecuta el script desde tu terminal:
    ```bash
    python python_gemini_chatbot.py
    ```

## 4. Integración con Node.js

Para aplicaciones de backend o herramientas de línea de comandos en JavaScript, puedes usar el SDK de Node.js de Google AI.

### 4.1. Instalación del SDK

Inicializa un proyecto Node.js y luego instala el paquete `@google/generative-ai`:

```bash
npm init -y
npm install @google/generative-ai readline
```

### 4.2. Código de Ejemplo (Node.js)

Este ejemplo muestra cómo construir un chatbot interactivo en la consola usando Node.js y el SDK de Gemini.

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

// Configura tu API Key de Gemini
// Es altamente recomendable establecer GEMINI_API_KEY como una variable de entorno
// export GEMINI_API_KEY=\'TU_API_KEY_AQUI\'

// Inicializa el cliente de Gemini
// El cliente buscará automáticamente la API Key en la variable de entorno GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return `Error al obtener respuesta de Gemini: ${error.message}`;
  }
}

async function main() {
  console.log("¡Bienvenido al Chatbot de Gemini 2.5 Pro (Node.js)!");
  console.log("Escribe \'salir\' para terminar la conversación.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  for await (const line of rl) {
    if (line.toLowerCase() === "salir") {
      break;
    }
    const geminiResponse = await getGeminiResponse(line);
    console.log(`Gemini: ${geminiResponse}`);
    rl.prompt();
  }

  rl.close();
  console.log("¡Hasta luego!");
}

main();
```

### 4.3. Cómo Ejecutarlo

1.  Guarda el código anterior como `nodejs_gemini_chatbot.js`.
2.  Asegúrate de haber configurado tu `GEMINI_API_KEY` como variable de entorno.
3.  Ejecuta el script desde tu terminal:
    ```bash
    node nodejs_gemini_chatbot.js
    ```

## 5. Integración Web (Frontend y Backend)

Para un chatbot accesible a través de un navegador web, necesitarás una arquitectura cliente-servidor. El frontend (HTML/JavaScript) se encargará de la interfaz de usuario, mientras que el backend (Node.js/Express) gestionará las solicitudes a la API de Gemini.

### 5.1. Arquitectura

*   **Frontend:** Un archivo `index.html` con JavaScript (`web_gemini_chatbot.js`) para la interfaz de usuario y la comunicación con el backend. 
*   **Backend:** Un servidor Node.js con Express (`server.js`) que expone un endpoint para recibir los prompts del usuario y reenviarlos a la API de Gemini. También sirve los archivos estáticos del frontend. 
*   **Variables de Entorno:** Un archivo `.env` para almacenar de forma segura la `GEMINI_API_KEY`.

### 5.2. Código de Ejemplo

#### 5.2.1. `index.html` (Frontend)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Gemini 2.5 Pro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .chat-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .chat-box {
            border: 1px solid #ddd;
            padding: 10px;
            height: 300px;
            overflow-y: scroll;
            margin-bottom: 10px;
            border-radius: 4px;
            background-color: #e9e9e9;
        }
        .user-message {
            text-align: right;
            color: #007bff;
        }
        .gemini-message {
            text-align: left;
            color: #28a745;
        }
        input[type="text"] {
            width: calc(100% - 80px);
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
        }
        button {
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1>Chatbot Gemini 2.5 Pro</h1>
        <div class="chat-box" id="chatBox"></div>
        <input type="text" id="userInput" placeholder="Escribe tu mensaje...">
        <button id="sendButton">Enviar</button>
    </div>

    <script type="module" src="./web_gemini_chatbot.js"></script>
</body>
</html>
```

#### 5.2.2. `web_gemini_chatbot.js` (Frontend JavaScript)

```javascript
document.addEventListener(\'DOMContentLoaded\', () => {
    const chatBox = document.getElementById(\'chatBox\');
    const userInput = document.getElementById(\'userInput\');
    const sendButton = document.getElementById(\'sendButton\');

    const appendMessage = (sender, message) => {
        const messageElement = document.createElement(\'p\');
        messageElement.classList.add(sender === \'user\' ? \'user-message\' : \'gemini-message\');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    };

    sendButton.addEventListener(\'click\', async () => {
        const message = userInput.value.trim();
        if (message) {
            appendMessage(\'user\', `Tú: ${message}`);
            userInput.value = \'\';

            try {
                const response = await fetch(\'/chat\', {
                    method: \'POST\',
                    headers: {
                        \'Content-Type\': \'application/json\',
                    },
                    body: JSON.stringify({ prompt: message }),
                });
                const data = await response.json();
                appendMessage(\'gemini\', `Gemini: ${data.response}`);
            } catch (error) {
                appendMessage(\'gemini\', `Gemini: Error al comunicarse con el servidor: ${error.message}`);
            }
        }
    });

    userInput.addEventListener(\'keypress\', (e) => {
        if (e.key === \'Enter\') {
            sendButton.click();
        }
    });
});
```

#### 5.2.3. `server.js` (Backend Node.js con Express)

```javascript
import express from \'express\';
import { GoogleGenerativeAI } from \'@google/generative-ai\';
import dotenv from \'dotenv\';

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(\".\")); // Sirve archivos estáticos desde el directorio actual

// Inicializa el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post(\'/chat\', async (req, res) => {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
        return res.status(400).json({ error: \'No se proporcionó ningún prompt.\' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error(\'Error al comunicarse con Gemini API:\', error);
        res.status(500).json({ error: \'Error al obtener respuesta de Gemini.\' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
```

#### 5.2.4. `.env` (Variables de Entorno)

```
GEMINI_API_KEY=TU_API_KEY_AQUI
```

### 5.3. Cómo Ejecutarlo

1.  Crea los archivos `index.html`, `web_gemini_chatbot.js`, `server.js` y `.env` con el contenido proporcionado en la sección 5.2.
2.  Asegúrate de haber instalado las dependencias de Node.js (`express` y `@google/generative-ai`) como se explicó en la sección 4.1.
3.  Configura tu `GEMINI_API_KEY` en el archivo `.env`.
4.  Inicia el servidor Node.js:
    ```bash
    node server.js
    ```
5.  Abre tu navegador web y navega a `http://localhost:3000`.

## 6. Consideraciones Adicionales y Buenas Prácticas

*   **Manejo de Errores:** Implementa un manejo robusto de errores en tu código para capturar y gestionar posibles fallos en la comunicación con la API de Gemini. 
*   **Seguridad de la API Key:** Nunca expongas tu API Key directamente en el código del lado del cliente (frontend). Siempre úsala en el lado del servidor o a través de variables de entorno. 
*   **Gestión de Conversaciones:** Para chatbots más avanzados, considera implementar la gestión del historial de la conversación para mantener el contexto en interacciones de varias vueltas. El SDK de Gemini ofrece funcionalidades para esto. 
*   **Límites de Uso:** Ten en cuenta los límites de tasa y cuota de la API de Gemini. 
*   **Prompt Engineering:** Experimenta con diferentes prompts para obtener las respuestas deseadas del modelo. La calidad de la respuesta de Gemini depende en gran medida de la calidad del prompt. 
*   **Modelos:** Aunque esta guía se centra en Gemini 2.5 Pro, Google AI ofrece otros modelos Gemini (como Gemini 2.5 Flash) que pueden ser más adecuados para diferentes casos de uso en términos de latencia y costo. 

## 7. Referencias

[1] Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)
[2] Documentación de la API de Gemini: [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
[3] Guía de inicio rápido de la API de Gemini (Python): [https://ai.google.dev/gemini-api/docs/quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
[4] Guía de inicio rápido de la API de Gemini (JavaScript): [https://ai.google.dev/gemini-api/docs/quickstart?lang=javascript](https://ai.google.dev/gemini-api/docs/quickstart?lang=javascript)
