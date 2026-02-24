import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { type RootState } from "../redux/store";
import { Store, Building2, BarChart3, Calendar, MapPin, ChevronRight, ExternalLink, LayoutDashboard, PlusCircle, ArrowUpRight, Info } from "lucide-react";
import Loading from "../components/Loading";

const ExhibitorDashboard = () => {
  const { data: user, authorization } = useSelector((state: RootState) => state.user);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("registered");

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const userId = (user as any)._id || (user as any).id;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/exhibitor-booths`, {
          headers: { Authorization: `Bearer ${authorization}` },
        });
        setExhibitions(response.data);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchExhibitions();
  }, [user, authorization]);

  if (loading) return <Loading />;

  const filtered = exhibitions.filter((e) => (statusFilter === "all" ? true : e.status === statusFilter));

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 bg-gray-50 border-r border-gray-100 flex-col p-10 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-14">
          <div className="p-3 bg-green-600 rounded-[22px] text-white shadow-xl shadow-green-100">
            <Store size={26} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Exhibitor</h2>
        </div>

        <nav className="space-y-3 flex-1">
          <Link
            to="/exhibitor"
            className="flex items-center gap-4 p-4 bg-white text-green-700 rounded-3xl font-bold border border-green-100 shadow-sm transition-all"
          >
            <LayoutDashboard size={22} /> Dashboard
          </Link>
          <Link
            to="/exhibitor/profile"
            className="flex items-center gap-4 p-4 text-gray-500 hover:bg-white hover:text-gray-900 rounded-3xl font-bold transition-all"
          >
            <Building2 size={22} /> Company Info
          </Link>
        </nav>

        <div className="mt-auto p-8 bg-linear-to-br from-gray-900 to-gray-800 rounded-[40px] text-white overflow-hidden relative group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all duration-700" />
          <h4 className="font-bold mb-3 relative z-10 text-lg">Expand Presence</h4>
          <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed relative z-10">Discover new events to showcase your brand and products.</p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm hover:bg-green-500 transition-all relative z-10"
          >
            Explore <PlusCircle size={16} />
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-16 bg-white animate-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Exhibition Hub</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">Everything you need to manage your presence at our upcoming events.</p>
          </div>

          <div className="flex bg-gray-50 p-2 rounded-3xl border border-gray-100 w-fit">
            {["registered", "confirmed", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-8 py-3 rounded-2xl text-sm font-black capitalize transition-all ${statusFilter === tab ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {filtered.map((booth) => (
              <div
                key={booth._id}
                className="bg-white rounded-[48px] border-2 border-gray-50 hover:border-green-100 transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/5 group"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-[32px] p-2 flex items-center justify-center border border-gray-100 group-hover:rotate-3 transition-transform duration-500">
                        <img
                          src={booth.eventId.image || "https://placehold.co/100"}
                          alt=""
                          className="w-full h-full object-cover rounded-[24px]"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{booth.eventId.title}</h3>
                        <div className="flex flex-wrap items-center gap-5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2">
                            <Calendar
                              size={14}
                              className="text-green-500"
                            />{" "}
                            {new Date(booth.eventId.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin
                              size={14}
                              className="text-green-500"
                            />{" "}
                            {booth.eventId.venue?.name || "Venue TBD"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest ${
                        booth.status === "confirmed" ? "bg-green-50 text-green-700" : booth.status === "registered" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {booth.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-gray-50 rounded-[32px] p-6 hover:bg-white border border-transparent hover:border-green-100 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Store
                            size={16}
                            className="text-green-600"
                          />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booth Details</p>
                      </div>
                      <p className="text-xl font-black text-gray-900">
                        #{booth.boothNumber} <span className="text-sm font-medium text-gray-400 ml-2">({booth.boothSize})</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-[32px] p-6 hover:bg-white border border-transparent hover:border-blue-100 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <BarChart3
                            size={16}
                            className="text-blue-600"
                          />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analytics</p>
                      </div>
                      <p className="text-xl font-black text-gray-900">
                        -- <span className="text-sm font-medium text-gray-400 ml-2">Visitors</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-2xl border-4 border-white bg-gray-100"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-400">Team Invited</span>
                    </div>
                    <Link
                      to={`/exhibitor/booth/${booth._id}`}
                      className="inline-flex items-center gap-3 py-4 px-8 bg-gray-900 text-white rounded-[24px] font-black text-sm hover:bg-green-600 transition-all group/btn"
                    >
                      Manage Booth{" "}
                      <ArrowUpRight
                        size={18}
                        className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center mb-10 group hover:rotate-6 transition-transform">
              <Store
                size={48}
                className="text-gray-200"
              />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Launch Your Showcase</h3>
            <p className="text-lg text-gray-500 font-medium mb-12 leading-relaxed">Register to exhibit at our events and put your innovations in front of thousands of potential customers.</p>
            <Link
              to="/events"
              className="px-12 py-5 bg-green-600 text-white font-black rounded-[28px] hover:shadow-2xl hover:shadow-green-200 transition-all flex items-center gap-4"
            >
              <PlusCircle size={22} /> Become an Exhibitor
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExhibitorDashboard;
