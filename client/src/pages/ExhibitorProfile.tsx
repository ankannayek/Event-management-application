const ExhibitorProfile = () => {
  return (
    <div className="min-h-screen bg-[#DDD9C8] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Company Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-gray-700 mb-2">Website</label>
            <input
              type="text"
              placeholder="https://yourcompany.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              placeholder="contact@company.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              placeholder="+91 9876543210"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* About Company */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">About Company</label>
            <textarea
              rows={4}
              placeholder="Write something about your company..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Logo Upload */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Upload Logo</label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-8 text-right">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorProfile;