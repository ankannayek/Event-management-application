import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../redux/store";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Globe, Building, Mail, Phone, AlignLeft, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SponsorProfile = () => {
  const { data: user, authorization } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    websiteUrl: "",
    logoUrl: "",
    benefits: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: (user as any).companyName || "",
        websiteUrl: (user as any).websiteUrl || "",
        logoUrl: (user as any).logoUrl || "",
        benefits: (user as any).benefits || "",
        email: (user as any).email || "",
        mobileNumber: (user as any).mobileNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userId = (user as any)._id || (user as any).id;
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${authorization}` },
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen rlative bg-gray-50 flex items-center justify-center p-6 md:p-12">
      <div className="w-full relative max-w-4xl bg-white rounded-[48px] shadow-2xl shadow-bg-amber-900/10  border border-gray-100">
        <Link
          to="/sponsor"
          className="absolute top-0 -left-10"
        >
          <ArrowLeft />
        </Link>
        <div className="flex flex-col md:flex-row">
          {/* Sidebar info */}
          <div className="md:w-1/3 bg-amber-600 p-12 text-white flex flex-col justify-between rounded-l-[48px]">
            <div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8">
                <Building size={40} />
              </div>
              <h1 className="text-3xl font-black mb-4 leading-tight">Brand Identity</h1>
              <p className="text-bg-amber-100 font-medium opacity-80 leading-relaxed">Your profile details will be shared with organizers and displayed on event pages once you become a sponsor.</p>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <p className="text-sm font-bold opacity-70">{(user as any).email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:w-2/3 p-12">
            <header className="mb-10">
              <h2 className="text-2xl font-black text-gray-900">Complete Your Sponsor Profile</h2>
              <p className="text-gray-500 font-medium">Standardize your brand appearance across all events.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Building
                    size={12}
                    className="text-bg-amber-500"
                  />{" "}
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-bg-amber-100 transition-all font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe
                    size={12}
                    className="text-bg-amber-500"
                  />{" "}
                  Website URL
                </label>
                <input
                  type="text"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://acme.com"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-bg-amber-100 transition-all font-bold text-gray-800"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon
                    size={12}
                    className="text-bg-amber-500"
                  />{" "}
                  Logo URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://path-to-your-logo.png"
                    className="flex-1 bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-bg-amber-100 transition-all font-bold text-gray-800"
                  />
                  {formData.logoUrl && (
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={formData.logoUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft
                    size={12}
                    className="text-bg-amber-500"
                  />{" "}
                  Company Benefits
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your company and what you do..."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-bg-amber-100 transition-all font-bold text-gray-800 placeholder:font-medium resize-none"
                />
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full py-5 bg-amber-600 text-white rounded-[24px] font-black text-lg hover:shadow-2xl hover:shadow-bg-amber-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Save Profile Details"}
              </button>
              <p className="text-center text-xs text-gray-400 font-bold mt-6 uppercase tracking-widest font-mono">Changes reflect instantly on all your deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorProfile;
