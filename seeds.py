from app import app, db, Category, Product, BlogPost, Branch

def seed_data():
    with app.app_context():
        # Clean current data
        db.drop_all()
        db.create_all()

        # Categories
        cat_chocolate = Category(name="Chocolate", slug="chocolate")
        cat_frutas = Category(name="Frutas", slug="frutas")
        cat_rellenas = Category(name="Rellenas", slug="rellenas")
        cat_especias = Category(name="Especias", slug="especias")
        
        db.session.add_all([cat_chocolate, cat_frutas, cat_rellenas, cat_especias])
        db.session.commit()

        # Products (from catalog)
        products = [
            Product(
                name="Chocolate Chip Clásica",
                description="Nuestra galleta insignia con chips de chocolate belga. Crujiente por fuera, suave por dentro.",
                price=15.0,
                image_url="/static/img/cookie_chocolate.png",
                category_id=cat_chocolate.id,
                is_best_seller=True,
                sabor="chocolate",
                tamano="individual",
                tags="Chocolate Negro, Vainilla"
            ),
            Product(
                name="Red Velvet",
                description="Galleta red velvet con relleno cremoso de cream cheese. Irresistible.",
                price=18.0,
                image_url="/static/img/cookie_hero.png",
                category_id=cat_frutas.id,
                is_new=True,
                sabor="frutas",
                tamano="individual",
                tags="Red Velvet, Cream Cheese"
            ),
            Product(
                name="Chai Especial",
                description="Canela, cardamomo y jengibre en una galleta aromática y cálida.",
                price=18.0,
                image_url="/static/img/cookie_chai.png",
                category_id=cat_especias.id,
                is_limited=True,
                sabor="especias",
                tamano="individual",
                tags="Canela, Cardamomo, Jengibre"
            ),
            Product(
                name="Nutella Bomb",
                description="Rellena de Nutella cremosa. Explosión de sabor en cada mordida.",
                price=22.0,
                image_url="/static/img/cookie_chocolate.png",
                category_id=cat_rellenas.id,
                is_best_seller=True,
                sabor="rellenas",
                tamano="individual",
                tags="Nutella, Avellana"
            )
        ]
        
        db.session.add_all(products)
        
        # Blog Posts
        posts = [
            BlogPost(
                title="El secreto de la Red Velvet",
                content="Descubre cómo logramos ese color rojo vibrante y la textura perfecta...",
                category="Receta",
                image_url="/static/img/cookie_hero.png"
            ),
            BlogPost(
                title="Nacimiento de Heleta 2020",
                content="Cómo una pasión por hornear se convirtió en la galletería favorita de La Paz.",
                category="Historia",
                image_url="/static/img/cookie_chai.png"
            )
        ]
        db.session.add_all(posts)

        # Branches
        branches = [
            Branch(name="La Paz - Central", address="Calle Sagárnaga #123", hours="Lun - Dom: 08:00 - 20:00", lat=-16.5002, lng=-68.1232),
            Branch(name="Cochabamba", address="Av. América Esq. Potosí", hours="Lun - Sáb: 09:00 - 21:00"),
            Branch(name="Santa Cruz - El Cristo", address="2do Anillo y Monseñor Rivero", hours="Lun - Vie: 08:00 - 22:00")
        ]
        db.session.add_all(branches)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
