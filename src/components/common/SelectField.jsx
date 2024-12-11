export default function SelectField({ label, options, value, onChange }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
        <select
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  