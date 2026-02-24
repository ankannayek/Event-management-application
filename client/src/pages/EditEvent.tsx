import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { toast } from "sonner";

const EditEvent: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const authorization = useSelector(
        (state: RootState) => state.user.authorization
    );

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "conference",
        startDate: "",
        endDate: "",
        image: "",
        maxCapacity: "",
        ticketPrice: "",
        venueName: "",
    });

    const inputStyle =
        "w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition";


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(
                    `${BACKEND_URL}/api/events/${eventId}`
                );

                const event = res.data.event;

                setFormData({
                    title: event.title,
                    description: event.description,
                    type: event.type,
                    startDate: event.startDate.split("T")[0],
                    endDate: event.endDate.split("T")[0],
                    image: event.image,
                    maxCapacity: event.maxCapacity,
                    ticketPrice: event.ticketPrice,
                    venueName: event.venue?.name || "",
                });
            } catch (error) {
                toast.error("Failed to load event");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


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

            toast.success("Image updated successfully");
        } catch (error) {
            toast.error("Image upload failed");
        } finally {
            setImageUploading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.put(
                `${BACKEND_URL}/api/events/${eventId}`,
                {
                    ...formData,
                    maxCapacity: Number(formData.maxCapacity),
                    ticketPrice: Number(formData.ticketPrice),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                    },
                }
            );

            toast.success("Event Updated Successfully");
            navigate("/organizer");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-orange-400 text-lg">
                Loading Event...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 p-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-orange-400">
                    Edit Event
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />

                    <textarea
                        name="description"
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
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            required
                            className={inputStyle}
                        />
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            required
                            className={inputStyle}
                        />
                    </div>


                    <input
                        type="text"
                        value={formData.venueName}
                        readOnly
                        className={`${inputStyle} bg-gray-100`}
                    />


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

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer px-6 py-3 bg-orange-400 text-white rounded-xl font-semibold"
                        >
                            {loading ? "Updating..." : "Update Event"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditEvent;