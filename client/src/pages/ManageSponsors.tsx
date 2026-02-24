import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { CheckCircle2, XCircle, Clock, Trash2, ExternalLink, ArrowLeft, Trophy, Search } from "lucide-react";

const ManageSponsors = () => {
  const { eventId } = useParams();
  const { authorization } = useSelector((state: RootState) => state.user);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSponsors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/sponsors`, {
        headers: { Authorization: `Bearer ${authorization}` },
      });
      setSponsors(response.data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, [eventId, authorization]);

  const handleUpdateStatus = async (sponsorId: string, status: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/sponsors/${sponsorId}`, { status }, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success(`Sponsor ${status === "active" ? "approved" : "updated"} successfully`);
      fetchSponsors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update sponsor");
    }
  };

  const handleDelete = async (sponsorId: string) => {
    if (!window.confirm("Are you sure you want to remove this sponsor?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/sponsors/${sponsorId}`, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success("Sponsor removed successfully");
      fetchSponsors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove sponsor");
    }
  };

  if (loading) return <Loading />;

  const filtered = sponsors.filter((s) => s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || s.tierName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <Link
            to="/organizer"
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Sponsors</h1>
              <p className="text-gray-500 font-medium">Review and approve sponsorship applications for your event.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search sponsors..."
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6">
          {filtered.length > 0 ? (
            filtered.map((sponsor) => (
              <div
                key={sponsor._id}
                className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-blue-900/5 hover:border-blue-100 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100">
                      <img
                        src={sponsor.logoUrl || "https://placehold.co/100?text=Logo"}
                        alt=""
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{sponsor.companyName}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{sponsor.tierName}</span>
                        <a
                          href={sponsor.websiteUrl}
                          target="_blank"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest ${
                        sponsor.status === "active" ? "bg-green-50 text-green-700" : sponsor.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {sponsor.status === "active" ? <CheckCircle2 size={14} /> : sponsor.status === "pending" ? <Clock size={14} /> : <XCircle size={14} />}
                      {sponsor.status}
                    </div>

                    <div className="h-10 w-[1px] bg-gray-100 hidden lg:block mx-2" />

                    <div className="flex items-center gap-3">
                      {sponsor.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(sponsor._id, "active")}
                          className="px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                          <CheckCircle2 size={18} /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sponsor._id)}
                        className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <Trophy
                size={48}
                className="mx-auto text-gray-200 mb-6"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-2">No sponsors found</h3>
              <p className="text-gray-500 font-medium">Try searching for something else or wait for new applications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSponsors;
