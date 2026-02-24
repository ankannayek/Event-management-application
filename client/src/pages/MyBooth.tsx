import { useParams } from "react-router-dom";

const MyBooth = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#DDD9C8] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Booth #{id}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booth Name */}
          <div>
            <label className="block text-gray-700 mb-2">Booth Name</label>
            <input
              type="text"
              placeholder="Enter booth name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Booth Category */}
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              placeholder="Technology, Food, Fashion..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your booth..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload Banner */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Booth Banner</label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-8 text-right">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default MyBooth;
