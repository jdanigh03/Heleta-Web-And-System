import os
import random
from flask import Flask, render_template, jsonify, request
from config import Config

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

app = Flask(__name__)
app.config.from_object(Config)


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


@app.route('/api/suerte', methods=['POST'])
def api_suerte():
    """Genera una frase de galleta de la suerte usando IA."""
    fallback_frases = [
        "El camino más dulce comienza con un primer bocado valiente.",
        "Tu creatividad es el ingrediente secreto que nadie puede copiar.",
        "Las mejores recetas de vida se escriben con paciencia y amor.",
        "Hoy es el día perfecto para hornear nuevos comienzos.",
        "La fortuna sonríe a quienes se atreven a probar sabores desconocidos.",
        "Tu historia tiene más capas que el mejor pastel de hojaldre.",
        "El éxito es como el azúcar: se disuelve lentamente pero endulza todo.",
        "Confía en tu instinto; incluso los mejores chefs improvisan.",
        "Cada desafío es una oportunidad de agregar un ingrediente nuevo a tu receta.",
        "La vida es más rica cuando la compartes con quienes aprecias.",
    ]

    api_key = os.environ.get('GEMINI_API_KEY')

    if GEMINI_AVAILABLE and api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                "Genera UNA sola frase corta y creativa para una galleta de la suerte. "
                "Debe ser inspiradora, divertida o filosófica. "
                "Temática relacionada con galletas, repostería, Bolivia o la vida cotidiana. "
                "Máximo 20 palabras. Solo la frase, sin comillas ni explicación."
            )
            response = model.generate_content(prompt)
            frase = response.text.strip().strip('"').strip("'")
            return jsonify({'frase': frase, 'source': 'ai'})
        except Exception:
            pass

    # Fallback: frase aleatoria del listado
    frase = random.choice(fallback_frases)
    return jsonify({'frase': frase, 'source': 'fallback'})


if __name__ == '__main__':
    app.run(debug=True)
