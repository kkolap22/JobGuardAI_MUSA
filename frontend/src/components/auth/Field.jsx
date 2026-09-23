export default function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none transition placeholder:text-slate-400 focus:border-[#08ad50] focus:ring-4 focus:ring-[#08ad50]/10" />
    </label>
  );
}