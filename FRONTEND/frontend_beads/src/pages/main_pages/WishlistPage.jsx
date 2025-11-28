"use client";

export default function WishlistPage({ wishlist = [], onNavigate }) {
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">♡</div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
          <p className="text-slate-600 mb-8">Add items to your wishlist by clicking the heart icon!</p>
          <button
            onClick={() => onNavigate("shop")}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Your Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="w-full h-48 bg-slate-100 rounded mb-4"></div>
              <h3 className="font-serif font-bold text-slate-900 mb-2">{item.name}</h3>
              <p className="text-slate-600 mb-4">${item.price}</p>
              <button className="w-full px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
