import { Link } from "react-router-dom";

const ExhibitorDashboard = () => {
  return (
    <div className="min-h-screen bg-[#DDD9C8] p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Exhibitor Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Booth Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">My Booth</h2>
          <p className="text-gray-600 mb-4">
            Manage your booth details and promotional materials.
          </p>
          <Link
            to="/exhibitor/booth/1"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Manage Booth
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Company Profile</h2>
          <p className="text-gray-600 mb-4">
            Update company information and branding.
          </p>
          <Link
            to="/exhibitor/profile"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Edit Profile
          </Link>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-2 text-gray-700">
            <p>Visitors: <strong>120</strong></p>
            <p>Leads Collected: <strong>34</strong></p>
            <p>Messages: <strong>5</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorDashboard;