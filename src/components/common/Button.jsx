export default function Button({ text, onClick, type = 'button', className, size='small', icon, disabled }) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`bg-[#6d445e] text-white ${size === 'small'? 'px-4 py-2' : 'px-5 py-3'} rounded-full hover:bg-[#4e8d99] ${className}`}
      >
        {icon && <span className='mr-2'>{icon}</span>} 
        {text}
      </button>
    );
  }
  