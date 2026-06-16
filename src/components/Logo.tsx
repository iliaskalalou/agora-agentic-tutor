export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#4f46e5" />
        <path d="M16 7l7 12.5H9z" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
        <line x1="12" y1="17" x2="20" y2="17" stroke="white" strokeWidth="2.4" />
      </svg>
      <div className="leading-none">
        <div className="text-[17px] font-extrabold tracking-tight text-slate-900">Agora</div>
        <div className="text-[11px] text-slate-400">Adaptive AI tutor</div>
      </div>
    </div>
  );
}
