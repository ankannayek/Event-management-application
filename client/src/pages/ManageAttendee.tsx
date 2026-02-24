import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

interface Attendee {
    _id: string;
    ticketType: string;
    amountPaid: number;
    status: "active" | "cancelled";
    registeredAt: string;
    userId: {
        name: string;
        email: string;
        _id: string;
    };
}

const ManageAttendees: React.FC = () => {
    const { eventId } = useParams();
    const authorization = useSelector(
        (state: RootState) => state.user.authorization
    );

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await axios.get(
                    `${BACKEND_URL}/api/events/${eventId}/attendees`,
                    {
                        headers: {
                            Authorization: `Bearer ${authorization}`,
                        },
                    }
                );

                setAttendees(res.data);
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message || "Failed to fetch attendees"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAttendees();
    }, [eventId, authorization]);


    const handleCancel = async (registrationId: string) => {
        try {
            setCancellingId(registrationId);

            await axios.delete(
                `${BACKEND_URL}/api/registrations/${registrationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                    },
                }
            );


            setAttendees((prev) =>
                prev.map((attendee) =>
                    attendee._id === registrationId
                        ? { ...attendee, status: "cancelled" }
                        : attendee
                )
            );

            toast.success("Registration cancelled successfully");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Cancellation failed"
            );
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-orange-400 text-lg">
                Loading Attendees...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-orange-400">
                    Manage Attendees
                </h1>

                {attendees.length === 0 ? (
                    <p className="text-gray-500">No attendees registered yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-orange-100 text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Ticket</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Registered</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendees.map((attendee) => (
                                    <tr
                                        key={attendee._id}
                                        className="border-t border-gray-200"
                                    >
                                        <td className="p-3">
                                            {attendee.userId?.name}
                                        </td>
                                        <td className="p-3">
                                            {attendee.userId?.email}
                                        </td>
                                        <td className="p-3 capitalize">
                                            {attendee.ticketType}
                                        </td>
                                        <td className="p-3">
                                            ₹ {attendee.amountPaid}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${attendee.status === "active"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {attendee.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {new Date(
                                                attendee.registeredAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            {attendee.status === "active" ? (
                                                <button
                                                    onClick={() =>
                                                        handleCancel(attendee._id)
                                                    }
                                                    disabled={
                                                        cancellingId === attendee._id
                                                    }
                                                    className="px-4 py-1 bg-red-500 text-white rounded-sm cursor-pointer text-sm hover:bg-red-600 transition"
                                                >
                                                    {cancellingId === attendee._id
                                                        ? "Cancelling..."
                                                        : "Cancel"}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAttendees;