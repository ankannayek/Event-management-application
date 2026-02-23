import { MdError } from 'react-icons/md';

interface ErrorProps {
  text?: string;
}


function Error({ text = "Something went wrong!" }: ErrorProps) {
    return (
        <div className="loading-container w-full h-50 flex justify-center gap-2 items-center">
            <MdError color="red" size={24} />
            <h1 className="font-semibold">{text}</h1>
        </div>
    );
}

export default Error;