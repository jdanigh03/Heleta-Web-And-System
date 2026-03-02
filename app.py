import os
import random
from flask import Flask, render_template, request, jsonify
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# --- Gemini 2.5 Pro Chatbot ---
GEMINI_MODEL = "gemini-2.5-pro"
HELA_SYSTEM = """Eres Hela, la asistente virtual de Heleta (tienda de galletas).
Respondes siempre en español, de forma amable y breve.
Ayudas con: sugerencias de galletas, precios, pedidos, sucursales y dudas generales.
Si el usuario tiene un problema con su pedido, ofrécele ayuda y di que puedes tomar sus datos para crear un ticket de soporte.
No inventes precios ni productos; si no sabes algo, recomienda contactar por la web o visitar una sucursal."""

# --- Routes ---

@app.route('/')
def home():
    return render_template('pages/home.html')


@app.route('/catalogo')
def catalogo():
    return render_template('pages/catalogo.html')


@app.route('/producto/<int:product_id>')
def producto(product_id):
    return render_template('pages/producto.html', product_id=product_id)


@app.route('/carrito')
def carrito():
    return render_template('pages/carrito.html')


@app.route('/checkout')
def checkout():
    return render_template('pages/checkout.html')


@app.route('/packs')
def packs():
    return render_template('pages/packs.html')


@app.route('/ediciones')
def ediciones():
    return render_template('pages/ediciones.html')


@app.route('/club')
def club():
    return render_template('pages/club.html')


@app.route('/blog')
def blog():
    return render_template('pages/blog.html')


@app.route('/sucursales')
def sucursales():
    return render_template('pages/sucursales.html')


@app.route('/about')
def about():
    return render_template('pages/about.html')


@app.route('/soporte')
def soporte():
    return render_template('pages/soporte.html')


@app.route('/suerte')
def suerte():
    return render_template('pages/suerte.html')


# --- Chatbot API (Gemini 2.5 Pro) ---

def _gemini_client():
    from google import genai
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise ValueError('GEMINI_API_KEY no está configurada. Añádela en .env o variables de entorno.')
    return genai.Client(api_key=api_key)


def _build_contents(history, current_message):
    """Construye la lista de contents para Gemini con historial + mensaje actual."""
    from google.genai.types import Content, Part
    contents = []
    for item in history:
        role = 'user' if item.get('role') == 'user' else 'model'
        text = item.get('text', '')
        if text:
            contents.append(Content(role=role, parts=[Part(text=text)]))
    contents.append(Content(role='user', parts=[Part(text=current_message)]))
    return contents


@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.get_json() or {}

    # Envío de ticket de soporte (sin Gemini)
    if data.get('ticket'):
        name = data.get('name', '')
        email = data.get('email', '')
        order_id = data.get('order_id', '')
        detail = data.get('detail', '')
        # TODO: guardar en BD o enviar email
        reply = (
            f"Gracias {name}. Recibimos tu ticket de soporte. "
            "Te contactaremos a {email} a la brevedad.".format(name=name, email=email)
        )
        if order_id:
            reply += f" Pedido referido: {order_id}."
        return jsonify({'reply': reply})

    message = (data.get('message') or '').strip()
    if not message:
        return jsonify({'reply': 'Escribe algo y te respondo. 😊'}), 200

    history = data.get('history') or []
    show_ticket_form = any(
        p in message.lower()
        for p in ('problema con mi pedido', 'problema con pedido', 'reclamo', 'tengo un problema')
    )

    try:
        client = _gemini_client()
        contents = _build_contents(history, message)
        from google.genai.types import GenerateContentConfig
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=GenerateContentConfig(system_instruction=[HELA_SYSTEM])
        )
        reply = (response.text or '').strip() or 'No pude generar una respuesta.'
    except ValueError as e:
        return jsonify({'reply': '⚠️ El chatbot no está configurado. Contacta al administrador.'}), 200
    except Exception as e:
        print(f"[CHATBOT ERROR] {type(e).__name__}: {e}")
        return jsonify({'reply': '⚠️ Error temporal. Intenta de nuevo en un momento.'}), 200

    out = {'reply': reply}
    if show_ticket_form:
        out['form'] = 'ticket'
    return jsonify(out)


# --- Galleta de la Suerte API ---

@app.route('/api/suerte', methods=['POST'])
def api_suerte():
    fallback_frases = [
        "El camino mas dulce comienza con un primer bocado valiente.",
        "Tu creatividad es el ingrediente secreto que nadie puede copiar.",
        "Las mejores recetas de vida se escriben con paciencia y amor.",
        "Hoy es el dia perfecto para hornear nuevos comienzos.",
        "La fortuna sonrie a quienes se atreven a probar sabores desconocidos.",
        "Tu historia tiene mas capas que el mejor pastel de hojaldre.",
        "El exito es como el azucar: se disuelve lentamente pero endulza todo.",
        "Confia en tu instinto; incluso los mejores chefs improvisan.",
        "Cada desafio es una oportunidad de agregar un ingrediente nuevo a tu receta.",
        "La vida es mas rica cuando la compartes con quienes aprecias.",
    ]

    frase = random.choice(fallback_frases)
    return jsonify({'frase': frase, 'source': 'fallback'})


if __name__ == '__main__':
    app.run(debug=True)
