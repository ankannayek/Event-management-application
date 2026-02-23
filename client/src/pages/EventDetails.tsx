import { useParams } from 'react-router-dom'
import { CiMusicNote1 } from "react-icons/ci";

const EventDetails = () => {
    const { eventId } = useParams()
    return (
        <div className="min-h-screen max-w-5xl mx-auto w-full">
            <div className="banner relative h-50 bg-cover bg-center bg-[url('/travel-bg.png')] rounded-lg">
                <div className="event-type rounded-full flex justify-center items-center w-25 h-25 border border-gray-300 bg-amber-100 absolute -bottom-10 left-10">
                    <CiMusicNote1 size={50} />
                </div>

            </div>

        </div>
    )
}

export default EventDetails