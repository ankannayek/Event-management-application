import Error from "@/components/Error"
import Loading from "@/components/Loading"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

const Events = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [eventsData, setEventsData] = useState<IEvent[]>([])

    const [type, setType] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [upcomingOnly, setUpcomingOnly] = useState(false)

    useEffect(() => {
        async function getEvents() {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events`)
                setEventsData(res.data)
            } catch (error: any) {
                setError('Failed to fetch event data')
            } finally {
                setLoading(false)
            }
        }
        getEvents()
    }, [])

    const filteredEvents = useMemo(() => {
        return eventsData.filter((event) => {
            const eventDate = new Date(event.startDate)

            if (type && event.type !== type) return false

            if (minPrice && event.ticketPrice < Number(minPrice)) return false
            if (maxPrice && event.ticketPrice > Number(maxPrice)) return false

            // console.log(eventDate<new Date())
            // console.log(eventDate,new Date())
            if (upcomingOnly && eventDate < new Date()) return false

            return true
        })
    }, [eventsData, type, minPrice, maxPrice, upcomingOnly])

    if (error) {
        return <div className='wrapper min-h-[80vh] px-4'><Error /></div>
    }

    if (loading) {
        return <div className='wrapper min-h-[80vh] px-4'><Loading /></div>
    }

    return (
        <div className="min-h-screen w-full flex flex-col max-w-6xl mx-auto p-5">
            <h1 className="text-3xl text-orange-600 mt-2 text-center">
                Discover What’s Happening Around You...
            </h1>

            <div className="flex gap-10 mt-10 flex-col sm:flex-row">

                <div className="w-full sm:w-[30%] border rounded-lg border-orange-400 p-5">
                    <h1 className="text-2xl text-center mb-4">Filter</h1>


                    <div className="mb-4">
                        <label className="block mb-1">Event Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">All</option>
                            <option value="conference">Conference</option>
                            <option value="wedding">Wedding</option>
                            <option value="concert">Concert</option>
                            <option value="corporate">Corporate</option>
                            <option value="other">Other</option>
                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block mb-1">Min Price</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block mb-1">Max Price</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={upcomingOnly}
                            onChange={(e) => setUpcomingOnly(e.target.checked)}
                        />
                        <label>Upcoming Only</label>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredEvents.length === 0 && (
                        <p>No events found.</p>
                    )}

                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            className="border rounded-lg p-5 shadow hover:scale-105 transition transform duration-300 relative"
                        >
                            <h2 className="text-xl font-semibold mt-3">{event.title}</h2>
                            <p className="text-gray-600">{event.description}</p>
                            <div className="last flex  w-full justify-between items-center mt-3">
                                <p className="text-orange-600 text-xl font-semibold">
                                    ₹{event.ticketPrice}
                                </p>
                                <Link to={`/event/${event._id}`}>
                                    <button className="bg-orange-400 text-white px-2 py-1 rounded-sm cursor-pointer">View details</button>

                                </Link>
                            </div>
                            <p className="bg-amber-200 w-fit rounded-xl p-1 text-xs absolute top-2 right-2 font-semibold">{event?.type}</p>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Events