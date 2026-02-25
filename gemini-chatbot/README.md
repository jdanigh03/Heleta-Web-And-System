# Integración de Chatbot con Gemini 2.5 Pro

Este directorio contiene ejemplos de integración de chatbots con el modelo **Gemini 2.5 Pro** de Google AI en diferentes lenguajes y plataformas.

## Estructura del Proyecto

```
gemini-chatbot/
├── python/                  # Ejemplo de chatbot en Python
├── nodejs/                  # Ejemplo de chatbot en Node.js (CLI)
├── web/                     # Ejemplo de chatbot web (Frontend + Backend)
├── docs/                    # Documentación y guías
└── README.md                # Este archivo
```

## Requisitos Previos

1. **API Key de Gemini:** Obtén una clave de API gratuita en [Google AI Studio](https://aistudio.google.com/)
2. **Variable de Entorno:** Configura la variable de entorno `GEMINI_API_KEY` con tu clave de API

```bash
export GEMINI_API_KEY='TU_API_KEY_AQUI'
```

## Ejemplos Disponibles

### 1. Python (`python/`)

Un chatbot simple en línea de comandos usando Python.

**Requisitos:**
- Python 3.9+
- `google-genai` (instala con `pip install -r requirements.txt`)

**Cómo ejecutar:**

```bash
cd python
pip install -r requirements.txt
python python_gemini_chatbot.py
```

### 2. Node.js CLI (`nodejs/`)

Un chatbot interactivo en la consola usando Node.js.

**Requisitos:**
- Node.js 18+
- Dependencias de npm

**Cómo ejecutar:**

```bash
cd nodejs
npm install
npm start
```

### 3. Aplicación Web (`web/`)

Una aplicación web completa con frontend HTML/CSS/JavaScript y backend Express.js.

**Requisitos:**
- Node.js 18+
- Dependencias de npm

**Cómo ejecutar:**

```bash
cd web
npm install
# Crea un archivo .env con tu GEMINI_API_KEY
cp .env.example .env
# Edita .env y reemplaza TU_API_KEY_AQUI con tu clave real
npm start
```

Luego abre tu navegador en `http://localhost:3000`

## Documentación

Para una guía completa de integración, consulta el archivo `docs/gemini_chatbot_integration_guide.md`.

## Características de Gemini 2.5 Pro

- ✅ Razonamiento avanzado
- ✅ Soporte multimodal (texto, imágenes, audio, video)
- ✅ Ventana de contexto amplia
- ✅ Optimizado para tareas complejas de varios pasos
- ✅ API flexible y fácil de integrar

## Seguridad

⚠️ **Importante:** Nunca expongas tu `GEMINI_API_KEY` directamente en el código o en repositorios públicos. Siempre usa variables de entorno o archivos `.env` que estén en `.gitignore`.

## Referencias

- [Google AI Studio](https://aistudio.google.com/)
- [Documentación de la API de Gemini](https://ai.google.dev/gemini-api/docs)
- [SDK de Python para Gemini](https://ai.google.dev/gemini-api/docs/quickstart)
- [SDK de JavaScript para Gemini](https://ai.google.dev/gemini-api/docs/quickstart?lang=javascript)

## Licencia

Este proyecto está bajo la licencia ISC.
