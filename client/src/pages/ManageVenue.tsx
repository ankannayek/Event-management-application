import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

const UpdateVenue: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const authorization = useSelector(
        (state: RootState) => state.user.authorization
    );

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [venueId, setVenueId] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        capacity: "",
        amenities: "",
    });

    const inputStyle =
        "w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition";


    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await axios.get(
                    `${BACKEND_URL}/api/events/${eventId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authorization}`,
                        },
                    }
                );

                const venue = res.data.event.venue;

                setVenueId(venue._id);

                setFormData({
                    name: venue.name,
                    address: venue.address,
                    city: venue.city,
                    capacity: venue.capacity.toString(),
                    amenities: venue.amenities.join(", "),
                });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please login again.");
                    navigate("/login");
                } else {
                    toast.error("Failed to load venue details");
                }
            } finally {
                setFetchLoading(false);
            }
        };

        fetchVenue();
    }, [eventId, authorization]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.put(
                `${BACKEND_URL}/api/venues/${venueId}`,
                {
                    ...formData,
                    capacity: Number(formData.capacity),
                    amenities: formData.amenities
                        .split(",")
                        .map((a) => a.trim()),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                    },
                }
            );

            toast.success("Venue Updated Successfully");
            navigate('/organizer');
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Unauthorized. Please login again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                toast.error("Access denied.");
            } else {
                toast.error(
                    error.response?.data?.message || "Update failed"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-orange-400 text-lg">
                Loading Venue...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 p-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-orange-400">
                    Update Venue
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />

                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />

                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                    />

                    <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleChange}
                        placeholder="wifi, parking, ac"
                        className={inputStyle}
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer px-6 py-3 bg-orange-400 text-white rounded-xl font-semibold"
                        >
                            {loading ? "Updating..." : "Update Venue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateVenue;