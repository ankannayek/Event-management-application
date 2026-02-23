import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="loading-container w-full h-50 flex justify-center">
      <FaSpinner className="mt-8 w-12.5 h-12.5 animate-spin" />
    </div>
  );
};

export default Loading;