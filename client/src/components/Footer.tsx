
import { FiArrowUpRight } from "react-icons/fi";

const Footer = () => {
    return (
        <div className=" w-full h-120 bg-gray-950 text-white flex flex-col justify-end items-center">
            <div className="content  max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 p-10 ">
                <div className="left">
                    <h1 className="text-3xl max-w-50">Stay event's ready</h1>
                    <div className="email flex items-center h-10 mt-5">
                        <input type="email" className="bg-gray-800 h-10 rounded-md p-2" placeholder="Your email" />
                        <div className="arr-con rounded-sm ml-2 w-10 h-10 bg-orange-400 flex justify-center items-center cursor-pointer">
                            <FiArrowUpRight className="  text-white" size={20} />

                        </div>
                    </div>

                </div>
                
                <div className="right mt-4 sm:mt-0 text-lg flex flex-col items-start sm:items-end">
                    <h1>Facebook</h1>
                    <h1>Linkedin</h1>
                    <h1>Twitter</h1>
                    <h1>Instagram</h1>
                </div>

                
            </div>
            <h1 className="text-center text-sm text-gray-300 mb-20">© All rights reserved.</h1>
        </div>
    )
}

export default Footer