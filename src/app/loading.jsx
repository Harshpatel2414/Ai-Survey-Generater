import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="flex flex-1 items-center justify-center h-dvh bg-white">
            <div className='w-full flex flex-1 items-center justify-center'>
                <FaSpinner className="animate-spin w-6 h-6 text-[#4e8d99]" />
            </div>
        </div>
    )
};

export default Loading;