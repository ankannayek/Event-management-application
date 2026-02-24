
import { FiArrowUpRight } from "react-icons/fi";

const Footer = () => {
    return (
        <div className=" w-full h-70 sm:h-120 bg-gray-950 text-white flex flex-col justify-end items-center">
            <div className="content  max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-10 ">
                <div className="left">
                    <h1 className="text-xl sm:text-3xl max-w-50">Stay event's ready</h1>
                    <div className="email flex items-center w-full mt-5">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-gray-800 h-10 rounded-md p-2 flex-1 min-w-0"
                        />
                        <div className="arr-con rounded-sm ml-2 w-10 h-10 bg-orange-400 flex justify-center items-center cursor-pointer flex-shrink-0">
                            <FiArrowUpRight className="text-white" size={20} />
                        </div>
                    </div>

                </div>

                <div className="right mt-4 sm:mt-0 text-sm sm:text-lg flex flex-col items-start sm:items-end">
                    <h1>Facebook</h1>
                    <h1>Linkedin</h1>
                    <h1>Twitter</h1>
                    <h1>Instagram</h1>
                </div>


            </div>
            <h1 className="text-center text-sm text-gray-300 mb-5 sm:mb-20">© All rights reserved.</h1>
        </div>
    )
}

export default Footer