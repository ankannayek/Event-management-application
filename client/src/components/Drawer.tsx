import { useState } from 'react';
import DropOn from '../assets/dropdown-on.svg';
import { Link, useLocation } from 'react-router-dom';
import type { userStateType } from '@/redux/userSlice';

interface DrawerProps {
    authorization: string;
    localUser:userStateType;
    handleLogout: () => void;
}

export default function Drawer({
    authorization,
    localUser,
    handleLogout
}: DrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? 'text-black  font-semibold'
            : 'hover:text-black'
    }


    const getDashboardLink=()=>{
        if(localUser.role=='organizer'){
            return '/organizer'
        }else if(localUser.role=='attendee'){
            return '/dashboard'
        }
    }

    return (
        <div className=''>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 "
            >
                <img
                    src={DropOn}
                    alt="Toggle Drawer"
                    className={`cursor-pointer h-9 w-9 transition duration-300`}
                />
            </button>


            <div
                className={`fixed top-0 right-0 bottom-0 w-50 h-screen bg-amber-100 text-gray-400 z-40 shadow-lg 
  
  ${isOpen ? 'translate-x-0' : 'translate-x-full hidden pointer-events-none'}`}
            >
                <div className="ml-3 p-3 mt-20 font-medium text-xl ">
                    <Link to={getDashboardLink() || ''} className={getLinkClass('/dashboard')}>Dashboard</Link>
                </div>

                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/events" className={getLinkClass('/events')}>Events</Link>
                </div>

                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/exhibitor" className={getLinkClass('/exhibitor')}>Exhibitor</Link>
                </div>

                <div className="ml-3 p-3 font-medium text-xl">
                    <Link to="/sponsor" className={getLinkClass('/sponsor')}>Sponsor</Link>
                </div>


                {!authorization ? (
                    <Link to="/login">
                        <button className="cursor-pointer mt-3 ml-6 text-base text-white font-medium bg-orange-400 hover:bg-orange-500 p-2 px-4 rounded-md">
                            Login
                        </button>
                    </Link>
                ) : (
                    <>
                        <Link to="/profile">
                            <button className="cursor-pointer mt-3 ml-6 text-base text-white font-medium bg-orange-400 hover:bg-orange-500 p-2 px-4 rounded-md">
                                Profile
                            </button>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="cursor-pointer mt-3 ml-6 text-base text-white font-medium bg-orange-400 hover:bg-orange-500 p-2 px-4 rounded-md"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}