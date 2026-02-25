import os
import random
from flask import Flask, render_template, request, jsonify
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

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
