import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Layout from './Layout'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'

import ExhibitorDashboard from './pages/ExhibitorDashboard'
import MyBooth from './pages/MyBooth'
import ExhibitorProfile from './pages/ExhibitorProfile'
import SponsorDashboard from './pages/SponsorDashboard'
import SponsorProfile from './pages/SponsorProfile'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout />}>

          <Route index element={<Home />} />
          <Route path='events' element={<Events />} />
          <Route path='event/:eventId' element={<EventDetails />} />

          {/* 🔒 Exhibitor Protected Routes */}
          <Route
            path='exhibitor'
            element={
              <ProtectedRoute allowedRoles={['exhibitor']}>
                <ExhibitorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='exhibitor/booth/:id'
            element={
              <ProtectedRoute allowedRoles={['exhibitor']}>
                <MyBooth />
              </ProtectedRoute>
            }
          />

          <Route
            path='exhibitor/profile'
            element={
              <ProtectedRoute allowedRoles={['exhibitor']}>
                <ExhibitorProfile />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Sponsor Protected Routes */}
          <Route
            path='sponsor'
            element={
              <ProtectedRoute allowedRoles={['sponsor']}>
                <SponsorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='sponsor/profile'
            element={
              <ProtectedRoute allowedRoles={['sponsor']}>
                <SponsorProfile />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound />} />
        </Route>

        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default App