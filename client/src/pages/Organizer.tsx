import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // ---------------- Demo Data ----------------
  const events = [
    {
      _id: "1",
      title: "Tech Conference 2026",
      type: "conference",
      startDate: new Date("2026-03-12"),
      endDate: new Date("2026-03-14"),
    },
    {
      _id: "2",
      title: "Startup Meetup 2025",
      type: "corporate",
      startDate: new Date("2025-01-10"),
      endDate: new Date("2025-01-11"),
    },
    {
      _id: "3",
      title: "Music Concert 2024",
      type: "concert",
      startDate: new Date("2024-06-05"),
      endDate: new Date("2024-06-05"),
    },
  ];

  const registrations = [
    { eventId: "1", amountPaid: 2000, status: "active" },
    { eventId: "1", amountPaid: 2000, status: "active" },
    { eventId: "2", amountPaid: 1500, status: "active" },
  ];

  const sponsors = [{ status: "active" }, { status: "pending" }, { status: "active" }];

  // ---------------- Derived Stats ----------------
  const totalRevenue = registrations.filter((r) => r.status === "active").reduce((sum, r) => sum + r.amountPaid, 0);

  const now = new Date();

  const upcomingEvents = events.filter((e) => e.endDate >= now);
  const pastEvents = events.filter((e) => e.endDate < now);

  const getStatus = (start: Date, end: Date) => {
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Ongoing";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-10">
      {/* -------- Header -------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>

        <button
          onClick={() => navigate("/organizer/events/create")}
          className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-500 shadow-md"
        >
          + Create New Event
        </button>
      </div>

      {/* -------- Stats -------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Events</p>
          <h2 className="text-2xl font-bold mt-2">{events.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Registrations</p>
          <h2 className="text-2xl font-bold mt-2">{registrations.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-2">₹{totalRevenue}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Active Sponsors</p>
          <h2 className="text-2xl font-bold mt-2">{sponsors.filter((s) => s.status === "active").length}</h2>
        </div>
      </div>

      {/* -------- Active / Upcoming Events -------- */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Manage Events</h2>

        {upcomingEvents.map((event) => {
          const status = getStatus(event.startDate, event.endDate);

          return (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {event.startDate.toDateString()} - {event.endDate.toDateString()}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">{status}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/attendees`)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Attendees
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/sponsors`)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Sponsors
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/exhibitors`)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Exhibitors
                </button>

                <button
                  onClick={() => navigate(`/organizer/events/${event._id}/venue`)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                >
                  Venue
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* -------- Past Events -------- */}
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
                <p className="text-xs text-gray-500">{event.startDate.toDateString()}</p>
              </div>

              <button
                onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                className="text-sm text-blue-600 hover:underline"
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
