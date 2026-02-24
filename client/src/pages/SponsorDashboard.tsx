import { useState } from "react";
import { Link } from "react-router-dom";

const SponsorDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#DDD9C8] p-8 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Sponsor Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Package Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Sponsorship Package
            </h2>
            <p className="text-gray-600 mb-4">
              You are currently on the <span className="font-semibold">Gold Plan</span>.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              View Details
            </button>
          </div>

          {/* Branding Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Branding Assets
            </h2>
            <p className="text-gray-600 mb-4">
              Manage your logo, banners and promotional materials.
            </p>
            <Link
              to="/sponsor/profile"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Manage Branding
            </Link>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Performance
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>Event Impressions: <strong>8,240</strong></p>
              <p>Booth Visits: <strong>540</strong></p>
              <p>Lead Conversions: <strong>68</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Modal */}
{showModal && (
  <div
    className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Gold Sponsorship Plan
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>✔ Premium Booth Placement</p>
              <p>✔ Logo on Website & Event Banner</p>
              <p>✔ Social Media Promotion</p>
              <p>✔ Email Campaign Feature</p>
              <p>✔ Access to VIP Networking</p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorDashboard;