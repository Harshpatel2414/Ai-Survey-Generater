export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  multiline,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          rows={5}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {value}
        </textarea>
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}
    </div>
  );
}
