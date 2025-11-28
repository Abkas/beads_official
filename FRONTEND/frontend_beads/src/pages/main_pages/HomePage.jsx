import React from "react";

const HomePage = ({ onNavigate }) => {
  const featuredProducts = [
    { id: 1, name: "Amethyst Dream", price: 24.99, image: "/amethyst-purple-bracelet.jpg" },
    { id: 2, name: "Ocean Breeze", price: 19.99, image: "/blue-turquoise-beaded-bracelet.jpg" },
    { id: 3, name: "Forest Serenity", price: 22.99, image: "/green-jade-stone-bracelet.jpg" },
    { id: 4, name: "Rose Petal", price: 21.99, image: "/pink-rose-quartz-bracelet.jpg" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 md:py-32" style={{ backgroundColor: "var(--accent-light)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Handmade with Heart
          </h1>
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Discover ethically crafted bracelets that tell stories. Each piece is unique, sustainable, and made with
            purpose.
          </p>
          <button
            onClick={() => onNavigate("shop")}
            className="px-10 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105 text-white text-lg"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: "var(--foreground)" }}>
            New Arrivals
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Curated pieces from our latest collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-lg overflow-hidden transition-all hover:shadow-lg"
              style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
                >
                  <button
                    onClick={() => onNavigate("shop")}
                    className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-lg mb-2" style={{ color: "var(--foreground)" }}>
                  {product.name}
                </h3>
                <p className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
                  ${product.price}
                </p>
                <button
                  onClick={() => onNavigate("shop")}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 text-white"
                  style={{ backgroundColor: "var(--secondary-foreground)" }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-16"
            style={{ color: "var(--foreground)" }}
          >
            Why Choose Beads Official
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🌱", title: "Eco-Conscious", desc: "Made with sustainable, ethically-sourced materials" },
              { icon: "✨", title: "Artisan Crafted", desc: "Each bracelet is handmade by skilled artisans" },
              { icon: "❤️", title: "Quality First", desc: "Designed to last with meticulous attention to detail" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg text-center transition-all hover:shadow-md"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-bold text-xl mb-3" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: "var(--primary)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-white">Ready to Start Your Collection?</h2>
          <p className="text-lg text-white opacity-90 mb-8">
            Join our community of bracelet enthusiasts and discover pieces that resonate with your style.
          </p>
          <button
            onClick={() => onNavigate("shop")}
            className="px-10 py-4 rounded-full font-semibold transition-all hover:scale-105 text-white border-2 border-white hover:bg-white"
            style={{ color: "var(--primary)" }}
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
