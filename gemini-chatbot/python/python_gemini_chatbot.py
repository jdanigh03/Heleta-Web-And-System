import os
from google import genai

# Configura tu API Key de Gemini
# Es altamente recomendable establecer GEMINI_API_KEY como una variable de entorno
# export GEMINI_API_KEY='TU_API_KEY_AQUI'

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
    print("Escribe 'salir' para terminar la conversación.")

    while True:
        user_input = input("Tú: ")
        if user_input.lower() == 'salir':
            break
        
        gemini_response = get_gemini_response(user_input)
        print(f"Gemini: {gemini_response}")

if __name__ == "__main__":
    main()
