from flask import Flask, render_template
from config import Config

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


if __name__ == '__main__':
    app.run(debug=True)
