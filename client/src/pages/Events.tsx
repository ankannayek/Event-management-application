import Error from "@/components/Error"
import Loading from "@/components/Loading"
import axios from "axios"
import { useEffect, useState } from "react"


const Events = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [eventsData, setEventsData] = useState<IEvent[] | null>([])



    useEffect(() => {
        async function getEvents() {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events`)
                setEventsData(res.data)
                console.log(res.data)
            } catch (error: any) {
                console.log(error?.response?.data?.message || error?.message);
                setError('Failed to fetch event data')
            } finally {
                setLoading(false)
            }

        }
        getEvents()
    }, [])


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
        <div className="min-h-screen w-full flex flex-col max-w-5xl mx-auto p-5">
            <h1 className="text-3xl text-orange-600 mt-2 text-center">Discover What’s Happening Around You...</h1>
            <div className="con">
                <div className="left mt-10 w-[30%] border rounded-lg border-orange-400 p-5">
                    <h1 className="text-3xl text-center">Filter</h1>
                    <div className="hr h-px bg-orange-400 mt-2"></div>
                </div>
            </div>

        </div>
    )
}

export default Events