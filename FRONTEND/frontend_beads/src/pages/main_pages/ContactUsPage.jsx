import React from "react";

const ContactUsPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center text-slate-900 mb-12">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-8">Get In Touch</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">📍 Address</h4>
                <p className="text-slate-600">123 Craft Street, Artisan City, AC 12345</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">📧 Email</h4>
                <p className="text-slate-600">hello@beadsofficial.com</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">📞 Phone</h4>
                <p className="text-slate-600">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">🕐 Hours</h4>
                <p className="text-slate-600">Monday - Friday: 9AM - 6PM</p>
                <p className="text-slate-600">Saturday - Sunday: 10AM - 4PM</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {["📱", "🐦", "📸"].map((icon, idx) => (
                  <button key={idx} className="text-2xl hover:scale-125 transition-transform">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
