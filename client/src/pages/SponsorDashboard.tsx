import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { type RootState } from "../redux/store";
import { Trophy, Image as ImageIcon, BarChart3, Calendar, MapPin, ShieldCheck, ExternalLink, X, PlusCircle, LayoutDashboard, ArrowRight, Loader2, Info } from "lucide-react";
import Loading from "../components/Loading";

const SponsorDashboard = () => {
  const { data: user, authorization } = useSelector((state: RootState) => state.user);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const isProfileComplete = (user as any)?.companyName && (user as any)?.logoUrl;

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const userId = (user as any)._id || (user as any).id;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/sponsorships`, {
          headers: { Authorization: `Bearer ${authorization}` },
        });
        setSponsorships(response.data);
      } catch (error) {
        console.error("Error fetching sponsorships:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSponsorships();
  }, [user, authorization]);

  if (loading) return <Loading />;

  const filtered = sponsorships.filter((s) => (activeTab === "all" ? true : s.status === activeTab));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for context */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 bg-amber-500 rounded-2xl text-white shadow-lg shadow-purple-200">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Partner</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            to="/sponsor"
            className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all ${window.location.pathname === "/sponsor" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/events"
            className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all ${window.location.pathname === "/sponsor/events" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <ImageIcon size={20} /> Events
          </Link>
        </nav>

        {/* {!isProfileComplete && (
          <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-6 text-amber-900 mb-6">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Info size={16} /> Profile Incomplete
            </h4>
            <p className="text-xs text-amber-700/80 mb-4 font-medium leading-relaxed">Complete your brand profile to start sponsoring events.</p>
            <Link
              to="/sponsor/profile"
              className="inline-block w-full py-3 bg-white text-amber-700 rounded-2xl font-black text-sm text-center shadow-sm hover:shadow-md transition-all"
            >
              Complete Profile
            </Link>
          </div>
        )} */}

        <div className="bg-amber-500 rounded-[32px] p-6 text-white text-center mt-auto">
          <h4 className="font-bold mb-2">Want more exposure?</h4>
          <p className="text-xs text-purple-100 mb-4 font-medium opacity-80">Check out our premium events list to find your next partnership.</p>
          <Link
            to="/events"
            className="inline-block w-full py-3 bg-white text-bg-amber-500 rounded-2xl font-black text-sm hover:shadow-xl transition-all"
          >
            Browse Events
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Sponsor Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage and track all your event sponsorships in one place.</p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 w-fit">
            {["active", "pending", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-amber-500 text-white shadow-md shadow-purple-200" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filtered.map((sponsor) => (
              <div
                key={sponsor._id}
                className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-purple-900/5 overflow-hidden group hover:border-purple-200 transition-all"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-gray-50 rounded-3xl p-4 flex items-center justify-center border border-gray-100 group-hover:bg-purple-50 transition-colors">
                        <img
                          src={sponsor.eventId?.image || "https://placehold.co/100"}
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-bg-amber-500 transition-colors">{sponsor.eventId?.title}</h3>
                        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Calendar
                              size={12}
                              className="text-amber-500"
                            />{" "}
                            {sponsor.eventId?.startDate ? new Date(sponsor.eventId.startDate).toLocaleDateString() : "TBD"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin
                              size={12}
                              className="text-amber-500"
                            />{" "}
                            {sponsor.eventId?.venue?.name || "Venue TBD"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        sponsor.status === "active"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : sponsor.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                      }`}
                    >
                      {sponsor.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-3xl p-5 group-hover:bg-white border border-transparent group-hover:border-purple-100 transition-all">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tier</p>
                      <p className="text-lg font-black text-bg-amber-500">{sponsor.tierName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-3xl p-5 group-hover:bg-white border border-transparent group-hover:border-blue-100 transition-all">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Views</p>
                      <p className="text-lg font-black text-blue-600">--</p>
                    </div>
                    <div className="bg-gray-50 rounded-3xl p-5 group-hover:bg-white border border-transparent group-hover:border-green-100 transition-all">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Leads</p>
                      <p className="text-lg font-black text-green-600">--</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-400 ml-5 tracking-tight">+12 partners</span>
                    </div>
                    <Link
                      to={`/event/${sponsor.eventId?._id}`}
                      className="flex items-center gap-2 text-bg-amber-500 font-extrabold text-sm hover:gap-3 transition-all"
                    >
                      View Event <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-purple-900/10">
              <Trophy
                size={40}
                className="text-gray-200"
              />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Partnerships Found</h3>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">You haven't partnered with any events yet. Browse our list of events and find the perfect match for your brand.</p>
            <Link
              to="/events"
              className="px-10 py-4 bg-amber-500 text-white font-black rounded-[24px] hover:shadow-2xl hover:shadow-purple-200 transition-all flex items-center gap-3"
            >
              <PlusCircle size={20} /> Discover Events
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SponsorDashboard;
