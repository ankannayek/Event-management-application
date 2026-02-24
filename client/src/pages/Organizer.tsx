import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { toast } from "sonner";

interface EventType {
  _id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  venue?: {
    name: string;
  };
  maxCapacity: number;
  ticketPrice: number;
}

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const authorization = useSelector((state: RootState) => state.user.authorization);
  const user = useSelector((state: RootState) => state.user.data);

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      });

      const myEvents = res.data.filter((event: any) => event.organizerId?.toString() === user?.id?.toString());

      setEvents(myEvents);
      fetchRevenueAndRegistrations(myEvents);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueAndRegistrations = async (eventsList: EventType[]) => {
    try {
      let revenue = 0;
      let registrationsCount = 0;

      for (const event of eventsList) {
        const res = await axios.get(`${BACKEND_URL}/api/events/${event._id}/attendees`, {
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        });

        const attendees = res.data;

        const activeAttendees = attendees.filter((a: any) => a.status === "active");

        registrationsCount += activeAttendees.length;

        revenue += activeAttendees.reduce((sum: number, a: any) => sum + a.amountPaid, 0);
      }

      setTotalRevenue(revenue);
      setTotalRegistrations(registrationsCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authorization && user?.id) {
      fetchEvents();
    }
  }, [authorization, user]);

  const now = new Date();

  const upcomingEvents = events.filter((e) => new Date(e.endDate) >= now);

  const pastEvents = events.filter((e) => new Date(e.endDate) < now);

  const getStatus = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (now < s) return "Upcoming";
    if (now > e) return "Completed";
    return "Ongoing";
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-amber-50 p-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>

        <button
          onClick={() => navigate("/organizer/events/create")}
          className="cursor-pointer px-6 py-3 bg-orange-400 text-white rounded-xl text-lg font-semibold hover:bg-orange-500 shadow-md"
        >
          + Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-lg">Total Events</p>
          <h2 className="text-2xl font-bold mt-2">{events.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-lg">Total Registrations</p>
          <h2 className="text-2xl font-bold mt-2">{totalRegistrations}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-lg">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-2">₹{totalRevenue}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-lg">Active Events</p>
          <h2 className="text-2xl font-bold mt-2">{upcomingEvents.length}</h2>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Manage Events</h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.startDate).toDateString()} - {new Date(event.endDate).toDateString()}
                  </p>
                  <p className="text-xs text-gray-400">Venue: {event.venue?.name || "N/A"}</p>
                </div>

                <span className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full">{getStatus(event.startDate, event.endDate)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                  className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Edit Event
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/attendees`)}
                  className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Manage Attendees
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/sponsors`)}
                  className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Manage Sponsors
                </button>

                {/* <button
                                    onClick={() =>
                                        navigate(`/organizer/exhibitors/${event._id}`)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                                >
                                    Manage Exhibitors
                                </button> */}

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/venue`)}
                  className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Edit Venue
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Past Events</h2>

        {pastEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No past events</p>
        ) : (
          pastEvents.map((event) => (
            <div
              key={event._id}
              className="flex justify-between border-b pb-3 mb-3"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-gray-500">{new Date(event.startDate).toDateString()}</p>
              </div>

              <button
                onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                className="text-sm text-orange-500 hover:underline"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
