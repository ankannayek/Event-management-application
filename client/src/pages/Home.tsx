import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { CiMusicNote1 } from "react-icons/ci";
import { CiCalculator1 } from "react-icons/ci";
import { MdNightlife } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

const Home = () => {
  const tasks = useSelector((state: RootState) => state.user);
  console.log(tasks);
  return (
    <div className="min-h-screen  w-full flex flex-col items-center bg-amber-50 p-5">
      <div className="hero mt-25 max-w-4xl flex flex-col items-center p-3 gap-4">
        <h1 className="text-5xl lg:text-7xl  text-center font-bold">Event Management at Your Fingertips</h1>
        <p className="text-center text-gray-500 mt-2">Helping you create memorable experiences with ease. Let's turn your vision into reality!</p>
        <Link
          to="/signup"
          className="hover:scale-105 transform transition duration-200"
        >
          <button className="bg-orange-400 text-white px-3 py-2 rounded-md text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer">
            Get Started
            <FiArrowUpRight />
          </button>
        </Link>
      </div>

      <div className="second mt-10 max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-3xl max-w-md text-center mb-5">Create Unforgettable Event Experiences</h1>
        <div className="events w-full p-5 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="music p-5 rounded-xl bg-blue-400 hover:scale-105 transform transition duration-300">
            <div className="logo bg-white w-15 h-15 flex justify-center items-center rounded-md">
              <CiMusicNote1 size={30} />
            </div>

            <h1 className="text-md mt-2 font-bold">Music</h1>
            <h1 className="text-gray-600 font-semibold">Immerse yourself in the rhythm of unforgettable music events</h1>
          </div>
          <div className="night p-5 rounded-xl bg-amber-300 hover:scale-105 transform transition duration-300">
            <div className="logo bg-white w-15 h-15 flex justify-center items-center rounded-md">
              <MdNightlife size={30} />
            </div>

            <h1 className="text-md mt-2 font-bold">Nightlife</h1>
            <h1 className="text-gray-600 font-semibold">Discover the pulse of the city with our vibrant nightlife events.</h1>
          </div>
          <div className="holidays p-5 rounded-xl bg-yellow-500 hover:scale-105 transform transition duration-300">
            <div className="logo bg-white w-15 h-15 flex justify-center items-center rounded-md">
              <CiCalculator1 size={30} />
            </div>

            <h1 className="text-md mt-2 font-bold">Nightlife</h1>
            <h1 className="text-gray-600 font-semibold">Discover the pulse of the city with our vibrant nightlife events.</h1>
          </div>
        </div>
      </div>

      <div className="mb-20 top-dest max-w-5xl w-full  mt-20 grid grid-cols-1 sm:grid-cols-2 p-5">
        <div className="left p-5 flex flex-col space-y-4">
          <div className="img-con h-10 w-10 rounded-full overflow-hidden border border-gray-400">
            <img
              src="/taj.png"
              alt="Taj Mahal"
            />
          </div>
          <h1 className="text-3xl max-w-xs">Top Destinations in India</h1>

          <Link
            to="/events"
            className="hover:scale-105 transform transition duration-200 w-30"
          >
            <button className="bg-orange-400 text-white px-3 py-2 rounded-md text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer">
              View more
              <FiArrowUpRight />
            </button>
          </Link>
        </div>

        <div className="right p-5 relative rounded-xl bg-cover bg-center bg-[url('/travel-bg.png')] shadow shadow-gray-300 min-h-50 w-full hover:scale-105 transform transition duration-300">
          <div className="text flex gap-2 items-center bg-white absolute bottom-0 left-0 w-full p-3">
            <div className="loc bg-orange-100 rounded-full h-10 w-10 flex justify-center items-center text-orange-600">
              <CiLocationOn size={20} />
            </div>
            <div className="texts">
              <h1 className="text-xl font-semibold">Mumbai</h1>
              <h1 className="text-gray-500">B bloc 32 road</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
