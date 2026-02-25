import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.')); // Sirve archivos estáticos desde el directorio actual

// Inicializa el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
        return res.status(400).json({ error: 'No se proporcionó ningún prompt.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error('Error al comunicarse con Gemini API:', error);
        res.status(500).json({ error: 'Error al obtener respuesta de Gemini.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
