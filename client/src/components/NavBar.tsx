import { Link, useLocation } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import Drawer from './Drawer'
import { type RootState } from "../redux/store";
import { remove } from '../redux/userSlice'


function Navbar() {
    const dispatch = useDispatch()
    const location = useLocation()
    const authorization = useSelector((state: RootState) => state.user.authorization)
    //console.log(authorization)


    const handleLogout = () => {
        dispatch(remove())
        localStorage.removeItem('localUser')
    }




    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? 'text-black  font-semibold'
            : 'hover:text-black'
    }


    return (
        <header className='z-20 sticky top-4 w-full flex  justify-center bg-transparent backdrop-blur-md px-2 sm:px-10 '>
            <nav className="relative w-[80%] navbar flex sm:flex-row flex-col justify-between items-start sm:items-center text-2xl py-3 h-17.5 text-white font-bold ">
                <div className=''>
                    <Link to="/" className='flex items-center gap-2 h-10 w-10 rounded-full overflow-hidden'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className='font-normal text-gray-500 links text-lg h-full sm:flex hidden items-center'>
                    <ul className='gap-8 flex'>
                        <li><Link to='/dashboard' className={getLinkClass('/dashboard')}>Dashboard</Link></li>
                        <li><Link to='/events' className={getLinkClass('/events')}>Events</Link></li>
                        <li><Link to='/exhibitor' className={getLinkClass('/exhibitor')}>Exhibitor</Link></li>
                        <li><Link to='/sponsor' className={getLinkClass('/sponsor')}>Sponsor</Link></li>
                    </ul>


                </div>
                <div className="account sm:flex hidden items-center">
                    {!authorization ? (
                        <Link to='/login'>
                            <button className='cursor-pointer text-base bg-orange-400 hover:bg-orange-500 font-medium  p-2 px-4 rounded-md mx-3'>
                                Login
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className='cursor-pointer text-base  bg-orange-400 hover:bg-orange-500 font-medium  p-2  rounded-md mx-3'
                        >
                            Logout
                        </button>
                    )}
                </div>
                <div className=" small-dd sm:hidden block">
                    <Drawer authorization={authorization as string} handleLogout={handleLogout} />
                </div>
                <div className='trans-border absolute bottom-0 w-full h-px
                  bg-linear-to-r from-transparent via-orange-400 to-transparent'></div>
                <div className='trans-border absolute top-0 w-full h-px
                  bg-linear-to-r from-transparent via-orange-400 to-transparent'></div>
            </nav>
            <Toaster />
        </header>
    )
}

export default Navbar