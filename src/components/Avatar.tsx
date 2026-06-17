import type { AvatarConfig, AvatarCreature } from "../../shared/types";

export const AVATAR_CREATURES: AvatarCreature[] = ["fox", "owl", "robot", "cat"];
export const AVATAR_COLORS = ["#4f46e5", "#059669", "#d97706", "#e11d48", "#0284c7", "#7c3aed"];

// Simple, emoji-free SVG creatures drawn in white over a colored disc.
function Features({ creature }: { creature: AvatarCreature }) {
  switch (creature) {
    case "fox":
      return (
        <g fill="#fff">
          <path d="M20 22l6 8-6 2z" />
          <path d="M44 22l-6 8 6 2z" />
          <path d="M32 24l11 8-11 14L21 32z" />
          <circle cx="28" cy="33" r="2.2" fill={"#1f2937"} />
          <circle cx="36" cy="33" r="2.2" fill={"#1f2937"} />
          <circle cx="32" cy="40" r="1.8" fill={"#1f2937"} />
        </g>
      );
    case "owl":
      return (
        <g fill="#fff">
          <path d="M19 20l5 6-5 1z" />
          <path d="M45 20l-5 6 5 1z" />
          <circle cx="26" cy="32" r="7" />
          <circle cx="38" cy="32" r="7" />
          <circle cx="26" cy="32" r="3" fill="#1f2937" />
          <circle cx="38" cy="32" r="3" fill="#1f2937" />
          <path d="M32 36l3 4h-6z" fill="#1f2937" />
        </g>
      );
    case "robot":
      return (
        <g fill="#fff">
          <rect x="20" y="22" width="24" height="20" rx="4" />
          <rect x="31" y="14" width="2" height="6" />
          <circle cx="32" cy="13" r="2.4" />
          <circle cx="27" cy="31" r="3" fill="#1f2937" />
          <circle cx="37" cy="31" r="3" fill="#1f2937" />
          <rect x="27" y="37" width="10" height="2" rx="1" fill="#1f2937" />
        </g>
      );
    case "cat":
      return (
        <g fill="#fff">
          <path d="M21 21l4 8-7-1z" />
          <path d="M43 21l-4 8 7-1z" />
          <circle cx="32" cy="33" r="11" />
          <circle cx="28" cy="32" r="2.2" fill="#1f2937" />
          <circle cx="36" cy="32" r="2.2" fill="#1f2937" />
          <path d="M32 36l2 2-2 1-2-1z" fill="#1f2937" />
          <path d="M22 35h6M22 38h6M36 35h6M36 38h6" stroke="#1f2937" strokeWidth="1" />
        </g>
      );
  }
}

export default function Avatar({ config, size = 40 }: { config: AvatarConfig; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${config.creature} avatar`}>
      <circle cx="32" cy="32" r="31" fill={config.color} />
      <Features creature={config.creature} />
    </svg>
  );
}
