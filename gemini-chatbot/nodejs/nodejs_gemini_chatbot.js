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
