import { Link } from 'react-router-dom';
// Removed unused UI component imports

const products = [
  {
    id: 1,
    name: 'Classic Gold Bracelet',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    description: 'A timeless gold bracelet for every occasion.'
  },
  {
    id: 2,
    name: 'Silver Charm Bracelet',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1526178613658-3f1622045544?auto=format&fit=crop&w=400&q=80',
    description: 'Elegant silver bracelet with customizable charms.'
  },
  {
    id: 3,
    name: 'Beaded Friendship Bracelet',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: 'Colorful beads to celebrate friendship and joy.'
  },
  {
    id: 4,
    name: 'Leather Wrap Bracelet',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    description: 'Stylish leather wrap for a modern look.'
  }
];
// Removed unused ProductCard import

const HomePage = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-secondary/30 to-background">
        <div className="container-custom text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
            Timeless Elegance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of handcrafted bracelets. Each piece tells a story of artistry and sophistication.
          </p>
          <Link to="/products">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 mt-4 transition">
              View Collection
              <span className="ml-2">→</span>
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of premium bracelets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-semibold text-blue-600">${product.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/products">
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              View All Products
            </button>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold">Handcrafted Quality</h3>
              <p className="text-muted-foreground">
                Each bracelet is meticulously crafted by skilled artisans with attention to every detail.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold">Sustainable Materials</h3>
              <p className="text-muted-foreground">
                We source ethically and use sustainable materials to create beautiful, responsible jewelry.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold">Lifetime Guarantee</h3>
              <p className="text-muted-foreground">
                We stand behind our craftsmanship with a lifetime guarantee on all our pieces.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
