import os
import traceback
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from google import genai
from google.genai import types

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# --- Gemini AI Setup ---
GEMINI_KEY = os.environ.get('GEMINI_API_KEY')
gemini_client = None

HELETA_SYSTEM_PROMPT = """
Eres el asistente virtual de Heleta, una galletería artesanal boliviana premium.
Tu nombre es "Hela". Eres amable, entusiasta y experta en galletas.

INFORMACIÓN DE LA EMPRESA:
- Heleta es una galletería artesanal de Bolivia fundada en 2020
- Especialidad: galletas artesanales hechas con ingredientes premium
- Moneda: Bolivianos (Bs)
- WhatsApp de contacto: +591 78822909
- Horarios: Lun-Dom 08:00-20:00 (La Paz), Lun-Sáb 09:00-21:00 (Cochabamba)

CATÁLOGO DE PRODUCTOS:
1. Chocolate Chip Clásica - Bs 15 (⭐ Más Vendida)
2. Red Velvet - Bs 18 (🆕 Nueva)
3. Chai Especial - Bs 18 (🔥 Edición Limitada)
4. Matcha & White Choc - Bs 20
5. Avena y Pasas - Bs 12 (Sin Gluten)
6. Nutella Bomb - Bs 22
7. Pack Media Docena Chocolate - Bs 75
8. Pack Docena Surtida - Bs 130 (⭐ Más Vendida)

SUCURSALES:
- La Paz: Calle Sagárnaga #123
- Cochabamba: Av. América Esq. Potosí
- Santa Cruz: 2do Anillo y Monseñor Rivero

REGLAS IMPORTANTES:
- Responde SIEMPRE en español
- Sé breve y amigable (máximo 2-3 oraciones)
- Usa emojis moderadamente
- Si el cliente tiene un PROBLEMA o queja con un pedido, responde EXACTAMENTE con la palabra: TICKET_FORM
- Si no sabes algo, sugiere contactar por WhatsApp +591 78822909
- Nunca inventes productos o precios
"""

if GEMINI_KEY and GEMINI_KEY != 'YOUR_GEMINI_API_KEY_HERE':
    try:
        gemini_client = genai.Client(api_key=GEMINI_KEY)
        print('✅ Gemini AI (google-genai SDK) listo.')
    except Exception as e:
        print(f'⚠️  Error configurando Gemini: {e}')
else:
    print('⚠️  GEMINI_API_KEY no configurada.')

# --- Models ---

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    is_best_seller = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=False)
    is_limited = db.Column(db.Boolean, default=False)
    sabor = db.Column(db.String(50)) # chocolate, frutas, rellenas, especias
    tamano = db.Column(db.String(50)) # individual, media-docena, docena
    tags = db.Column(db.String(200)) # comma separated

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50)) # Receta, Historia, etc
    image_url = db.Column(db.String(200))

class Branch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    hours = db.Column(db.String(100))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)

class SupportTicket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    issue_type = db.Column(db.String(50)) # sugerencia, problema_pedido
    order_id = db.Column(db.String(50))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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


# --- Chatbot API ---

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json

    # 1. Handle ticket submission FIRST
    if data.get('ticket'):
        try:
            new_ticket = SupportTicket(
                name=data.get('name'),
                email=data.get('email'),
                issue_type=data.get('issue_type', 'problema_pedido'),
                order_id=data.get('order_id'),
                message=data.get('detail')
            )
            db.session.add(new_ticket)
            db.session.commit()
            return jsonify({
                "reply": f"✅ ¡Ticket #{new_ticket.id} registrado! Nos contactaremos contigo a <b>{data.get('email')}</b> pronto.",
                "success": True
            })
        except Exception as e:
            db.session.rollback()
            print(f"Error saving ticket: {e}")
            return jsonify({
                "reply": "⚠️ Error al guardar el ticket. Contáctanos por WhatsApp: +591 78822909",
                "success": False
            })

    # 2. Handle regular messages with Gemini AI
    message = data.get('message', '')
    history = data.get('history', [])

    if gemini_client:
        try:
            # Build conversation contents for new google-genai SDK
            contents = []
            for msg in history:
                role = 'user' if msg.get('role') == 'user' else 'model'
                contents.append(
                    types.Content(role=role, parts=[types.Part.from_text(text=msg.get('text', ''))])
                )
            contents.append(
                types.Content(role='user', parts=[types.Part.from_text(text=message)])
            )

            response = gemini_client.models.generate_content(
                model='gemini-2.5-pro-exp-03-25',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=HELETA_SYSTEM_PROMPT,
                    max_output_tokens=300,
                    temperature=0.7,
                )
            )
            reply = response.text.strip()

            # Check if AI wants to show the ticket form
            if 'TICKET_FORM' in reply:
                return jsonify({
                    "reply": "😔 Siento mucho que tengas un problema. Vamos a resolverlo. Por favor completa el formulario:",
                    "form": "ticket"
                })

            return jsonify({"reply": reply})

        except Exception as e:
            print(f"Gemini error: {e}")
            traceback.print_exc()
            return jsonify({
                "reply": "Lo siento, tuve un problema. ¿Puedes intentar de nuevo? 🍪"
            })
    else:
        # Fallback: basic responses when Gemini is not configured
        msg_lower = message.lower()
        if any(w in msg_lower for w in ['problema', 'pedido', 'error', 'queja']):
            return jsonify({"reply": "😔 Completa el formulario para ayudarte:", "form": "ticket"})
        if any(w in msg_lower for w in ['sugerencia', 'recomienda', 'galleta', 'mejor']):
            return jsonify({"reply": "🍪 Te recomiendo: Chocolate Chip Clásica (Bs 15), Nutella Bomb (Bs 22) y Red Velvet (Bs 18). ¿Cuál te interesa?"})
        if any(w in msg_lower for w in ['hola', 'buenas', 'hey']):
            return jsonify({"reply": "¡Hola! 👋 Soy Hela, tu asistente de Heleta. ¿Puedo sugerirte galletas o ayudarte con un pedido?"})
        return jsonify({"reply": "¿En qué puedo ayudarte? Escribe \"sugerencia\" o \"problema con pedido\" 🍪"})


# --- Init DB ---
@app.route('/api/init-db')
def init_db():
    db.create_all()
    return jsonify({"status": "ok", "message": "Tables created successfully"})
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
    with app.app_context():
        try:
            db.create_all()
            print("✅ Base de datos conectada y tablas creadas correctamente.")
        except Exception as e:
            print(f"⚠️  No se pudo conectar a la base de datos: {e}")
            print("   La app iniciará sin conexión a DB. El chatbot usará respuestas de respaldo.")
            print("   Asegúrate de configurar tu contraseña en el archivo .env")
    app.run(debug=True)
