const RADIUS = 58;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MasteryDial({ value }: { value: number }) {
  const normalized = Math.min(1, Math.max(0, value));
  const percent = Math.round(normalized * 100);
  const dashOffset = CIRCUMFERENCE * (1 - normalized);

  return (
    <div className="relative grid h-36 w-36 place-items-center drop-shadow-[0_0_24px_rgba(62,207,142,0.22)]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140" role="img" aria-label={`${percent}% mastery`}>
        <defs>
          <linearGradient id="mastery-dial-gradient" x1="24" y1="24" x2="116" y2="116" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c83ff" />
            <stop offset="100%" stopColor="#3ecf8e" />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          stroke="url(#mastery-dial-gradient)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out drop-shadow-[0_0_10px_rgba(62,207,142,0.45)]"
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-white">{percent}%</div>
          <div className="label mt-1">mastery</div>
        </div>
      </div>
    </div>
  );
}
