import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Layout from './Layout'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element=<Layout />>
          <Route path='' element=<Home /> />
          <Route path='events' element=<Events /> />
          <Route path='event/:eventId' element=<EventDetails /> />
          <Route path='*' element=<NotFound /> />
        </Route>
        <Route path='signup' element=<Signup /> />
        <Route path='login' element=<Login /> />
      </>
    )
  )




  return (
    <RouterProvider router={router} />
  )
}

export default App