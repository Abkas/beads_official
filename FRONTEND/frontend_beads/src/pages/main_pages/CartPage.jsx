
import React from "react";

const CartPage = ({ cart = [], onNavigate }) => {
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Your cart is empty</h2>
          <p className="text-slate-600 mb-8">Start shopping to add items to your cart!</p>
          <button
            onClick={() => onNavigate("shop")}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border border-slate-200 rounded-lg">
                  <div className="w-24 h-24 bg-slate-100 rounded"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-slate-600">${item.price}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <button className="w-full px-4 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
