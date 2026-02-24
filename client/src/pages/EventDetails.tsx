import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Error from "../components/Error";
import type { IEvent } from "../types";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { type RootState } from "../redux/store";
import { Calendar, MapPin, Users, IndianRupee, Mail, Phone, ChevronRight, ShieldCheck, Store, Trophy, Info, Star, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventDetails = () => {
  const { eventId } = useParams();
  const { data: user, authorization } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState<any>(null);
  const [sponsors, setSponsors] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);

  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showExhibitorModal, setShowExhibitorModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    websiteUrl: "",
    logoUrl: "",
    benefits: "",
    tierName: "Silver",
    description: "",
    boothSize: "3x3",
  });

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`);
      setEventData(res.data.event);
      setSponsors(res.data.sponsors);
      setExhibitors(res.data.exhibitors);
    } catch (error: any) {
      console.error(error);
      setError("Failed to fetch event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const handleBook = async () => {
    if (!authorization) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }
    try {
      setRegistering(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/register`, { ticketType: "general" }, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success("Successfully registered for event");
      navigate("/dashboard/tickets");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleApplySponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorization) {
      toast.error("Please login as a sponsor to apply");
      navigate("/login");
      return;
    }

    if ((user as any)?.role !== "sponsor" && (user as any)?.role !== "admin") {
      toast.error("You must have a sponsor account to apply");
      return;
    }

   

    setApplying(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/apply-sponsor`, { ...formData, eventId }, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success("Successfully became a sponsor!");
      setShowSponsorModal(false);
      fetchEventDetails(); // Refresh list to show new sponsor instantly
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  const handleApplyExhibitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/apply-exhibitor`, { ...formData, eventId }, { headers: { Authorization: `Bearer ${authorization}` } });
      toast.success("Exhibitor application submitted successfully!");
      setShowExhibitorModal(false);
      fetchEventDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (error)
    return (
      <div className="p-8">
        <Error text={error} />
      </div>
    );
  if (loading || !eventData)
    return (
      <div className="p-8">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen pt-[10px] bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={eventData.image || "https://images.unsplash.com/photo-1540575861501-7ad05823c21b?q=80&w=2070"}
          alt={eventData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1 bg-amber-600 text-white text-xs font-bold uppercase rounded-full">{eventData.type}</span>
            <div className="flex items-center gap-1 text-white/80 text-sm font-medium">
              <Calendar
                size={14}
                className="text-amber-400"
              />
              {new Date(eventData.startDate).toLocaleDateString(undefined, { dateStyle: "long" })}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">{eventData.title}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-amber-400"
              />
              <span className="font-semibold">{eventData.venue?.name || "Global Venue Center"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-amber-900/5 p-8 border border-gray-100">
              <Tabs
                defaultValue="about"
                className="w-full"
              >
                <TabsList className="bg-gray-50 p-1.5 rounded-2xl mb-8 flex flex-wrap h-auto">
                  <TabsTrigger
                    value="about"
                    className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="sponsors"
                    className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                  >
                    Sponsors
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="exhibitors"
                    className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                  >
                    Exhibitors
                  </TabsTrigger> */}
                </TabsList>

                <TabsContent
                  value="about"
                  className="space-y-6 animate-in fade-in duration-500"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Info
                        size={20}
                        className="text-amber-600"
                      />
                      Event Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{eventData.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 font-semibold text-amber-800 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Users className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 uppercase font-black">Capacity</p>
                        <p className="text-xl">{eventData.maxCapacity} Attendees</p>
                      </div>
                    </div>
                    <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 font-semibold text-purple-800 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <ShieldCheck className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 uppercase font-black">Status</p>
                        <p className="text-xl capitalize">{eventData.status}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="sponsors"
                  className="space-y-8 animate-in fade-in duration-500"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Event Sponsors</h3>
                      <p className="text-sm text-gray-500">Partners making this event possible</p>
                    </div>
                    <button
                      onClick={() => setShowSponsorModal(true)}
                      className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all flex items-center gap-2"
                    >
                      <Trophy size={18} /> Become a Sponsor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sponsors.length > 0 ? (
                      sponsors.map((sponsor: any) => (
                        <div
                          key={sponsor._id}
                          className="group p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-amber-200 transition-all text-center"
                        >
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:scale-110 transition-transform">
                            <img
                              src={sponsor.logoUrl || "https://placehold.co/100x100?text=Sponsor"}
                              alt={sponsor.companyName}
                              className="max-w-full h-auto p-2"
                            />
                          </div>
                          <h4 className="font-bold text-gray-900">{sponsor.companyName}</h4>
                          <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-2 inline-block">{sponsor.tierName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <Star
                          size={40}
                          className="mx-auto text-gray-200 mb-4"
                        />
                        <p className="text-gray-400 font-medium">No sponsors yet. Be the first!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="exhibitors"
                  className="space-y-8 animate-in fade-in duration-500"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Exhibitors</h3>
                      <p className="text-sm text-gray-500">Showcasing products and innovations</p>
                    </div>
                    <button
                      onClick={() => setShowExhibitorModal(true)}
                      className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <Store size={18} /> Become an Exhibitor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {exhibitors.length > 0 ? (
                      exhibitors.map((exh: any) => (
                        <div
                          key={exh._id}
                          className="flex gap-6 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-green-200 transition-all"
                        >
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                              src={exh.logoUrl || "https://placehold.co/100x100?text=Exhibitor"}
                              alt={exh.companyName}
                              className="max-w-full h-auto p-2"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{exh.companyName}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exh.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-lg">Booth #{exh.boothNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <CheckCircle2
                          size={40}
                          className="mx-auto text-gray-200 mb-4"
                        />
                        <p className="text-gray-400 font-medium">Exhibitor list will be available soon.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Ticket Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl shadow-amber-900/10 p-8 border border-gray-100 sticky top-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Pass Price</p>
                  <h2 className="text-4xl font-black text-gray-900 flex items-center">
                    <IndianRupee size={28} /> {eventData.ticketPrice}
                  </h2>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <IndianRupee size={24} />
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={registering}
                className="w-full py-4 bg-linear-to-r from-amber-600 to-amber-600 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {registering ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {registering ? "Processing..." : "Secure Your Ticket"}
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                  <CheckCircle2
                    size={18}
                    className="text-green-500"
                  />{" "}
                  Instant Confirmation
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                  <CheckCircle2
                    size={18}
                    className="text-green-500"
                  />{" "}
                  Digital QR Ticket
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                  <AlertCircle
                    size={18}
                    className="text-amber-500"
                  />{" "}
                  Limited {eventData.maxCapacity} Seats
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 space-y-4">
                <h3 className="font-bold text-gray-900">Organizer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 group px-4 py-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 truncate">{eventData.organizerId?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 group px-4 py-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{eventData.organizerId?.mobileNumber || "9876543210"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modals */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            onClick={() => setShowSponsorModal(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-8 right-8 p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
            <div className="mb-10 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Become a Sponsor</h2>
              <p className="text-gray-500 mt-2 font-medium">Apply to partner with us for {eventData.title}</p>
            </div>
            <form
              onSubmit={handleApplySponsor}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Company / Brand Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Company Website</label>
                <input
                  type="url"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold"
                  placeholder="https://yourcompany.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Company Logo URL</label>
                <input
                  type="logoUrl"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold"
                  placeholder="https://yourcompany.com"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Benefits</label>
                <input
                  type="benefits"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold"
                  placeholder="https://yourcompany.com"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Sponsorship Level</label>
                <select
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold"
                  value={formData.tierName}
                  onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                >
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>
              <button
                disabled={applying}
                className="w-full py-5 bg-amber-600 text-white font-black rounded-3xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 flex items-center justify-center gap-2"
              >
                {applying ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                {applying ? "Submitting..." : "Submit Sponsorship Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showExhibitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            onClick={() => setShowExhibitorModal(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowExhibitorModal(false)}
              className="absolute top-8 right-8 p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
            <div className="mb-10 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Store size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Become an Exhibitor</h2>
              <p className="text-gray-500 mt-2 font-medium">Book a space to showcase your innovations</p>
            </div>
            <form
              onSubmit={handleApplyExhibitor}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Company / Brand Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Exhibition Description</label>
                <textarea
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold resize-none"
                  rows={3}
                  placeholder="What will you be showcasing?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Preferred Booth Size</label>
                <select
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold"
                  value={formData.boothSize}
                  onChange={(e) => setFormData({ ...formData, boothSize: e.target.value })}
                >
                  <option value="3x3">Standard (3x3m)</option>
                  <option value="6x3">Large (6x3m)</option>
                  <option value="6x6">Premium (6x6m)</option>
                </select>
              </div>
              <button
                disabled={applying}
                className="w-full py-5 bg-green-600 text-white font-black rounded-3xl hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-2"
              >
                {applying ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                {applying ? "Submitting..." : "Submit Exhibitor Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
