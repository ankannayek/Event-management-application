import "./App.css";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Layout from "./Layout";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ExhibitorDashboard from "./pages/ExhibitorDashboard";
import MyBooth from "./pages/MyBooth";
import ExhibitorProfile from "./pages/ExhibitorProfile";
import SponsorDashboard from "./pages/SponsorDashboard";
import SponsorProfile from "./pages/SponsorProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardLayout, Dashboard, Tickets, TicketDetail, Profile } from "./pages/dashboard/index";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import ManageAttendee from "./pages/ManageAttendee";
import ManageVenue from "./pages/ManageVenue";
import ManageSponsors from "./pages/ManageSponsors";
import ManageExhibitors from "./pages/ManageExhibitors";
import Organizer from "./pages/Organizer";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route
            path="events"
            element={<Events />}
          />
          <Route
            path="event/:eventId"
            element={<EventDetails />}
          />

          <Route
            path="exhibitor"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="exhibitor/booth/:id"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <MyBooth />
              </ProtectedRoute>
            }
          />

          <Route
            path="exhibitor/profile"
            element={
              <ProtectedRoute allowedRoles={["exhibitor"]}>
                <ExhibitorProfile />
              </ProtectedRoute>
            }
          />

          {/* Attendee Dashboard Routes */}
          <Route
            path="dashboard"
            element={<DashboardLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />
            <Route
              path="tickets"
              element={<Tickets />}
            />
            <Route
              path="tickets/:id"
              element={<TicketDetail />}
            />
            <Route
              path="profile"
              element={<Profile />}
            />
          </Route>


          <Route
            path="organizer"
            element={<Organizer />}
          />
          <Route
            path="organizer/events/create"
            element={<CreateEvent />}
          />
          <Route
            path="organizer/events/:eventId/edit"
            element={<EditEvent />}
          />
          <Route
            path="organizer/events/:eventId/attendees"
            element={<ManageAttendee />}
          />
          <Route
            path="organizer/events/:eventId/venue"
            element={<ManageVenue />}
          />
          <Route
            path="organizer/events/:eventId/sponsors"
            element={<ManageSponsors />}
          />
          <Route
            path="organizer/events/:eventId/exhibitors"
            element={<ManageExhibitors />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
        <Route
          path="sponsor"
          element={<SponsorDashboard />}
        />
        <Route
          path="sponsor/profile"
          element={<SponsorProfile />}
        />

        <Route
          path="signup"
          element={<Signup />}
        />
        <Route
          path="login"
          element={<Login />}
        />
      </>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
