import { ShieldCheck } from "lucide-react";

export default function Tag({
  icon: Icon = ShieldCheck,
  children,
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#c9efd6] bg-[#eafff1] px-3 py-2 text-[11px] font-extrabold tracking-[.14em] text-[#07843e]">
      <Icon size={15} />
      {children}
    </span>
  );
}