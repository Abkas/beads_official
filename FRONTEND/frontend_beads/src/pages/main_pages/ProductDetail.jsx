
export default function ProductDetail({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => onNavigate("shop")} className="text-amber-700 hover:text-amber-800 mb-8 font-medium">
          ← Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-slate-100 rounded-lg overflow-hidden">
            <img src="/amethyst-crystal-bracelet.jpg" alt="Product" className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Amethyst Dream</h1>
            <span className="text-3xl font-bold text-slate-900 mb-6 block">$24.99</span>

            <p className="text-slate-600 mb-8">
              A beautiful handcrafted bracelet featuring genuine amethyst beads. Each piece is unique and made with
              sustainable materials.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Quantity</label>
                <input
                  type="number"
                  defaultValue="1"
                  min="1"
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-lg font-medium">
                Add to Cart
              </button>
              <button className="w-full px-6 py-3 border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors">
                Add to Wishlist
              </button>
            </div>

            <div className="border-t pt-8">
              <h2 className="font-serif font-bold text-lg text-slate-900 mb-4">Details</h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <span className="font-medium">Material:</span> Amethyst, Natural Beads
                </li>
                <li>
                  <span className="font-medium">Size:</span> One Size (Adjustable)
                </li>
                <li>
                  <span className="font-medium">Handcrafted:</span> Yes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Rose Petal", price: 21.99 },
              { name: "Ocean Breeze", price: 19.99 },
              { name: "Forest Serenity", price: 22.99 },
              { name: "Boho Vibes", price: 25.99 },
            ].map((prod, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                <div className="bg-slate-200 h-48 rounded mb-4"></div>
                <h3 className="font-serif font-bold text-slate-900 mb-2">{prod.name}</h3>
                <p className="text-slate-600">${prod.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
