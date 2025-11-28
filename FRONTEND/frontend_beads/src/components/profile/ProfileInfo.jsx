const ProfileInfo = () => (
  <div>
    <h2 className="text-2xl font-serif font-bold mb-8">Profile Information</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Full Name</label>
        <input type="text" className="w-full px-4 py-2 border rounded" placeholder="Your Name" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <input type="email" className="w-full px-4 py-2 border rounded" placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Phone</label>
        <input type="tel" className="w-full px-4 py-2 border rounded" placeholder="123-456-7890" />
      </div>
    </div>
  </div>
);

export default ProfileInfo;
