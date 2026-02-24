import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';
import type { IEvent } from '../types';
import { IoMdCall } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { FcConferenceCall } from "react-icons/fc";
import { FaHeart } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { ImOffice } from "react-icons/im";
import { MdEventAvailable } from "react-icons/md";
import { type RootState } from "../redux/store";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const EventDetails = () => {
    const { eventId } = useParams()
    const user = useSelector((state: RootState) => state.user)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [registering, setRegistering] = useState(false)
    const [error, setError] = useState('')
    const [eventData, setEventData] = useState<IEvent | null>({})
    const [sponsors, setSponsors] = useState([])



    useEffect(() => {
        async function getEvent() {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`)
                setEventData(res.data.event)
                setSponsors(res.data.sponsors)
                console.log(res.data)
            } catch (error: any) {
                console.log(error?.response?.data?.message || error?.message);
                setError('Failed to fetch event data')
            } finally {
                setLoading(false)
            }

        }
        getEvent()
    }, [])

    async function handleBook() {
        if (!user.authorization) {
            toast.error('Login to continue')
            navigate('/login')
        } else {
            try {
                setRegistering(true)
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/register`,
                    { ticketType: 'general' },
                    {
                        headers: {
                            'Authorization': `Bearer ${user.authorization}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                console.log(res?.data)
                if (res.status == 201) {
                    toast.success('Successfully registered for event')
                    navigate('/dashboard')
                }



            } catch (error) {
                toast.error('Event registration failed!')
                console.log(error)
            } finally {
                setRegistering(false)
            }
        }
    }

    if (error) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Error />
        </div>
    }


    if (loading) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Loading />
        </div>
    }

    return (
        <div className="min-h-screen max-w-5xl mx-auto w-full">
            <div
                className="banner relative h-50 bg-cover bg-center rounded-lg"
                style={{
                    backgroundImage: eventData?.image
                        ? `url(${eventData.image})`
                        : "none",
                }}
            >
                <div className="event-type rounded-full flex justify-center items-center w-25 h-25 border border-gray-300 bg-amber-100 absolute -bottom-10 left-10">

                    {eventData?.type == 'conference' &&
                        <FcConferenceCall size={50} />
                    }
                    {eventData?.type == 'wedding' &&
                        <FaHeart size={50} />
                    }
                    {eventData?.type == 'concert' &&
                        <GiLoveSong size={50} />
                    }
                    {eventData?.type == 'corporate' &&
                        <ImOffice size={50} />
                    }
                    {eventData?.type == 'other' &&
                        <MdEventAvailable size={50} />
                    }
                </div>

            </div>

            <div className="second grid grid-cols-1 sm:grid-cols-2 mt-10 p-1 sm:p-5 gap-3">
                <div className="left  p-5 space-y-5">
                    <h1 className='text-2xl sm:text-3xl max-w-xs '>{eventData?.title}</h1>
                    <h1 className='text-xl sm:text-2xl text-gray-600'>{eventData?.description}</h1>

                    <div className="contacts grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <div className="call flex items-center gap-2">
                            <IoMdCall size={25} />
                            <h1 className='text-sm'>9876543210</h1>
                        </div>
                        <div className="email flex items-center gap-2">
                            <MdOutlineMail size={25} />
                            <h1 className='text-sm'>{eventData?.organizerId?.email}</h1>
                        </div>
                    </div>

                    <h1 className='text-3xl '>₹{eventData?.ticketPrice}</h1>
                    <button
                        onClick={handleBook}
                        className={`${registering ? 'bg-orange-600' : 'bg-orange-400'} text-white px-3 py-2 rounded-md cursor-pointer w-full hover:scale-105 transition transform duration-200 font-semibold`}
                    >{registering ? 'Booking...' : 'Book now'}</button>
                </div>
                <div className="right border-3 rounded-lg p-3">
                    <Tabs defaultValue="about" className="w-full mt-5">
                        <TabsList className='w-full bg-amber-200 '>
                            <TabsTrigger value="about" className='cursor-pointer '>About</TabsTrigger>
                            <TabsTrigger value="sponsor" className='cursor-pointer'>Sponsor</TabsTrigger>
                            <TabsTrigger value="exhibitor" className='cursor-pointer'>Exhibitor</TabsTrigger>
                        </TabsList>
                        <TabsContent value="about" className='p-3'>
                            <h1 className='font-semibold text-lg'>Start date: <span className='font-normal'>{new Date(eventData?.startDate as Date).toLocaleString('en-US')}</span></h1>
                            <h1 className='font-semibold text-lg'>End date: <span className='font-normal'>{new Date(eventData?.endDate as Date).toLocaleString('en-US')}</span></h1>
                            <h1 className='font-semibold text-lg'>Max Capacity: <span className='font-normal'>{eventData?.maxCapacity} Seats</span></h1>

                        </TabsContent>
                        <TabsContent value="sponsor">Change your password here.</TabsContent>
                        <TabsContent value="exhibitor">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
    )
}

export default EventDetails