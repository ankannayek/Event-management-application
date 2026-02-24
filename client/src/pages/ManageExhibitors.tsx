import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { CheckCircle2, XCircle, Clock, Trash2, ExternalLink, ArrowLeft, Store, Search, Layout } from "lucide-react";

const ManageExhibitors = () => {
  const { eventId } = useParams();
  const { authorization } = useSelector((state: RootState) => state.user);
  const [exhibitors, setExhibitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExhibitors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/exhibitors`, {
        headers: { Authorization: `Bearer ${authorization}` },
      });
      setExhibitors(response.data);
    } catch (error) {
      console.error("Error fetching exhibitors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, [eventId, authorization]);

  const handleUpdate = async (exhId: string, status: string, boothNumber?: string) => {
    try {
      const data: any = { status };
      if (boothNumber) data.boothNumber = boothNumber;

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/exhibitors/${exhId}`, data, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success(`Exhibitor ${status === "confirmed" ? "approved" : "updated"} successfully`);
      fetchExhibitors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update exhibitor");
    }
  };

  const handleDelete = async (exhId: string) => {
    if (!window.confirm("Are you sure you want to remove this exhibitor?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/exhibitors/${exhId}`, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success("Exhibitor removed successfully");
      fetchExhibitors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove exhibitor");
    }
  };

  if (loading) return <Loading />;

  const filtered = exhibitors.filter((e) => e.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || e.boothSize.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <Link
            to="/organizer"
            className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Exhibitors</h1>
              <p className="text-gray-500 font-medium">Review and assign booths to your exhibitors.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search exhibitors..."
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-green-100 transition-all font-bold"
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
            filtered.map((exh) => (
              <div
                key={exh._id}
                className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-green-900/5 hover:border-green-100 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100 group-hover:bg-green-50 transition-colors">
                      <img
                        src={exh.logoUrl || "https://placehold.co/100?text=Logo"}
                        alt=""
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{exh.companyName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Layout
                            size={14}
                            className="text-green-500"
                          />{" "}
                          Size: {exh.boothSize}
                        </span>
                        <span className="flex items-center gap-1.5 font-black text-green-600">Booth #{exh.boothNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest ${
                        exh.status === "confirmed" ? "bg-green-50 text-green-700" : exh.status === "registered" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {exh.status === "confirmed" ? <CheckCircle2 size={14} /> : exh.status === "registered" ? <Clock size={14} /> : <XCircle size={14} />}
                      {exh.status}
                    </div>

                    <div className="h-10 w-px bg-gray-100 hidden lg:block mx-2" />

                    <div className="flex items-center gap-3">
                      {exh.status === "registered" && (
                        <button
                          onClick={() => {
                            const booth = window.prompt("Enter Booth Number (e.g. A01):", "A01");
                            if (booth) handleUpdate(exh._id, "confirmed", booth);
                          }}
                          className="px-6 py-3 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
                        >
                          <CheckCircle2 size={18} /> Approve & Assign
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(exh._id)}
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
              <Store
                size={48}
                className="mx-auto text-gray-200 mb-6"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-2">No exhibitors found</h3>
              <p className="text-gray-500 font-medium">Try searching for something else or wait for new applications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExhibitors;
