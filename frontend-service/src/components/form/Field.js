export default function Field({label, name, value, onChange, type = "text"}) {
  return (
    <div className="mb-4">
      <label htmlFor={ name } className="sr-only">{ label }</label>
      <label className="block text-gray-700 text-left text-sm font-bold mb-2" htmlFor={ name }>{ label }</label>
      <input
        id={ name }
        name={ name }
        value={ value }
        type={ type }
        placeholder={ label }
        onChange={ onChange }
        required className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
    </div>
  );
}
