import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { type RootState } from "../redux/store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const authorization = useSelector(
    (state: RootState) => state.user.authorization
  );

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [loading, setLoading] = useState(false);
  const [venueLoading, setVenueLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "conference",
    startDate: "",
    endDate: "",
    image: "",
    maxCapacity: "",
    ticketPrice: "",
    venueId: "",
    venueName: "",
  });

  const [venueData, setVenueData] = useState({
    name: "",
    address: "",
    city: "",
    capacity: "",
    amenities: "",
  });

  const inputStyle =
    "w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueData({ ...venueData, [e.target.name]: e.target.value });
  };

  // ✅ CLOUDINARY IMAGE UPLOAD
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      setFormData((prev) => ({
        ...prev,
        image: res.data.secure_url,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  // ✅ CREATE VENUE
  const handleVenueSubmit = async () => {
    try {
      setVenueLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/venues`,
        {
          ...venueData,
          capacity: Number(venueData.capacity),
          amenities: venueData.amenities
            .split(",")
            .map((a) => a.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        venueId: res.data._id,
        venueName: res.data.name,
      }));

      toast.success("Venue Created Successfully");
      setDrawerOpen(false);

      setVenueData({
        name: "",
        address: "",
        city: "",
        capacity: "",
        amenities: "",
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Venue creation failed"
      );
    } finally {
      setVenueLoading(false);
    }
  };

  // ✅ CREATE EVENT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/events`,
        {
          ...formData,
          venue: formData.venueId,
          maxCapacity: Number(formData.maxCapacity),
          ticketPrice: Number(formData.ticketPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        }
      );

      toast.success("Event Created Successfully");
      navigate("/organizer");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Event creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-orange-400">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputStyle}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            className={inputStyle}
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="conference">Conference</option>
            <option value="wedding">Wedding</option>
            <option value="concert">Concert</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="maxCapacity"
              placeholder="Max Capacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <input
              type="number"
              name="ticketPrice"
              placeholder="Ticket Price"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Event Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 file:bg-orange-400 file:text-white file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4"
            />

            {imageUploading && (
              <p className="text-sm text-orange-400">
                Uploading image...
              </p>
            )}

            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          {/* VENUE SECTION */}
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.venueName}
              readOnly
              placeholder="Create Venue First"
              className={`${inputStyle} bg-gray-100`}
            />

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 bg-orange-400 text-white rounded-lg"
                >
                  + Venue
                </button>
              </DrawerTrigger>

              <DrawerContent>
                <div className="mx-auto w-full max-w-md p-6 space-y-4">
                  <DrawerHeader>
                    <DrawerTitle className="text-orange-400">
                      Create Venue
                    </DrawerTitle>
                    <DrawerDescription>
                      Add venue details below
                    </DrawerDescription>
                  </DrawerHeader>

                  {["name","address","city","capacity","amenities"].map((field) => (
                    <input
                      key={field}
                      type={field === "capacity" ? "number" : "text"}
                      name={field}
                      placeholder={field}
                      value={(venueData as any)[field]}
                      onChange={handleVenueChange}
                      className={inputStyle}
                    />
                  ))}

                  <DrawerFooter>
                    <button
                      type="button"
                      onClick={handleVenueSubmit}
                      disabled={venueLoading}
                      className="cursor-pointer px-4 py-2 bg-orange-400 text-white rounded-lg"
                    >
                      {venueLoading ? "Saving..." : "Save Venue"}
                    </button>

                    <DrawerClose asChild>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg">
                        Cancel
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-6 py-3 bg-orange-400 text-white rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;