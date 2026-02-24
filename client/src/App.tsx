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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='events' element={<Events />} />
          <Route path='event/:eventId' element={<EventDetails />} />

          <Route path='exhibitor' element={<ExhibitorDashboard />} />
          <Route path='exhibitor/booth/:id' element={<MyBooth />} />
          <Route path='exhibitor/profile' element={<ExhibitorProfile />} />

          <Route path='sponsor' element={<SponsorDashboard />} />
          <Route path='sponsor/profile' element={<SponsorProfile />} />

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