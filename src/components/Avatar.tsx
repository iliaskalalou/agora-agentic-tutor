import type { AccessoryId, AvatarConfig, HairStyle } from "../../shared/types";

// ---------------------------------------------------------------------------
// Option lists for the customizer UI.
// ---------------------------------------------------------------------------

export const HAIR_STYLES: HairStyle[] = [
  "short",
  "long",
  "buzz",
  "ponytail",
  "curly",
  "bald",
];

// ~5 realistic skin tones, light -> deep.
export const SKIN_TONES: string[] = [
  "#ffe0bd",
  "#f1c27d",
  "#e0ac69",
  "#c68642",
  "#8d5524",
];

// ~6 hair colors: black, brown, blonde, red, gray, and one fun color.
export const HAIR_COLORS: string[] = [
  "#1f2937",
  "#6b4423",
  "#e0b84c",
  "#b5562b",
  "#9ca3af",
  "#7c3aed",
];

// ~8 clothing colors usable for shirt / pants / shoes.
export const CLOTHING_COLORS: string[] = [
  "#4f46e5",
  "#059669",
  "#d97706",
  "#e11d48",
  "#0284c7",
  "#7c3aed",
  "#334155",
  "#f43f5e",
];

// ---------------------------------------------------------------------------
// Hair layer — shape depends on the chosen style, drawn over the head.
// The head is a rounded shape centered at x=32, top of skull around y=14.
// ---------------------------------------------------------------------------

function Hair({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case "bald":
      return null;

    case "buzz":
      // Thin cap close to the scalp.
      return (
        <path
          d="M19 25 Q19 13 32 13 Q45 13 45 25 Q45 21 32 20 Q19 21 19 25 Z"
          fill={color}
        />
      );

    case "short":
      // Rounded short hair covering the top, with a soft fringe.
      return (
        <path
          d="M18 27 Q18 11 32 11 Q46 11 46 27 Q43 22 39 23 Q36 19 32 19 Q28 19 25 23 Q21 22 18 27 Z"
          fill={color}
        />
      );

    case "long":
      // Hair framing both sides, falling down past the ears onto the shoulders.
      return (
        <g fill={color}>
          <path d="M17 42 Q15 22 32 11 Q49 22 47 42 Q44 40 42 41 Q44 28 32 21 Q20 28 22 41 Q20 40 17 42 Z" />
          <path d="M18 11 Q32 6 46 11 Q46 22 41 24 Q36 18 32 18 Q28 18 23 24 Q18 22 18 11 Z" />
        </g>
      );

    case "ponytail":
      // Short top plus a ponytail hanging on the back-right.
      return (
        <g fill={color}>
          <path d="M46 26 Q49 30 47 38 Q45 44 41 45 Q45 40 44 33 Q44 30 43 28 Z" />
          <path d="M18 27 Q18 11 32 11 Q46 11 46 27 Q43 22 39 23 Q36 19 32 19 Q28 19 25 23 Q21 22 18 27 Z" />
        </g>
      );

    case "curly":
      // Bumpy / scalloped rounded hair mass.
      return (
        <path
          d="M18 26
             a4 4 0 0 1 1 -7
             a4.5 4.5 0 0 1 5 -5
             a5 5 0 0 1 8 -2
             a5 5 0 0 1 8 2
             a4.5 4.5 0 0 1 5 5
             a4 4 0 0 1 1 7
             q-3 -4 -6 -3
             q-3 -4 -8 -3
             q-5 -1 -8 3
             q-3 -1 -6 3 Z"
          fill={color}
        />
      );
  }
}

// ---------------------------------------------------------------------------
// Accessory layer — drawn on top of the avatar.
// viewBox is 0 0 64 80; head centred at x=32, skull top ~y=14.
// ---------------------------------------------------------------------------

function Accessory({ id }: { id: AccessoryId }) {
  switch (id) {
    case "tophat":
      return (
        <g>
          <rect x="20" y="2" width="24" height="13" rx="2" fill="#1e293b" />
          <rect x="14" y="13" width="36" height="4" rx="2" fill="#334155" />
        </g>
      );
    case "sword":
      return (
        <g transform="rotate(-25 54 32)">
          <rect x="52" y="5" width="4" height="36" rx="1.5" fill="#94a3b8" />
          <rect x="47" y="29" width="14" height="4" rx="2" fill="#78716c" />
          <rect x="53" y="33" width="3" height="10" rx="1.5" fill="#92400e" />
        </g>
      );
    case "crown":
      return (
        <g fill="#f59e0b">
          <polygon points="16,16 20,6 27,13 32,4 37,13 44,6 48,16" />
          <rect x="15" y="14" width="34" height="5" rx="1" fill="#fbbf24" />
        </g>
      );
    case "graduation":
      return (
        <g>
          <polygon points="32,6 50,13 32,20 14,13" fill="#1e293b" />
          <rect x="29" y="2" width="6" height="7" rx="1" fill="#1e293b" />
          <line x1="46" y1="13" x2="49" y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="49" cy="23" r="2" fill="#f59e0b" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M18 21 Q18 9 32 9 Q46 9 46 21 Q44 17 32 16 Q20 17 18 21 Z" fill="#dc2626" />
          <path d="M15 20 Q32 23 49 20 L47 24 Q32 27 17 24 Z" fill="#b91c1c" />
          <circle cx="32" cy="10" r="2" fill="#fbbf24" />
        </g>
      );
    case "shield":
      return (
        <g transform="translate(-4 0)">
          <path d="M10 34 Q6 26 8 18 L18 18 Q20 26 14 34 Z" fill="#3b82f6" />
          <path d="M12 22 L12 30 M9 26 L15 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "wizard":
      return (
        <g>
          <polygon points="32,0 17,20 47,20" fill="#7c3aed" />
          <rect x="14" y="18" width="36" height="5" rx="2.5" fill="#6d28d9" />
          <circle cx="32" cy="8" r="2" fill="#fbbf24" opacity="0.9" />
        </g>
      );
    case "star":
      return (
        <polygon
          points="32,1 34,8 41,8 36,12 38,19 32,15 26,19 28,12 23,8 30,8"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="0.5"
        />
      );
    case "flame":
      return (
        <g>
          <path
            d="M32 2 Q37 7 35 12 Q39 8 37 14 Q41 9 38 16 Q35 11 32 15 Q29 11 26 16 Q23 9 27 14 Q25 8 29 12 Q27 7 32 2 Z"
            fill="#f97316"
          />
          <path
            d="M32 6 Q35 10 33 13 Q35 11 34 14 Q32 11 30 14 Q29 11 31 13 Q29 10 32 6 Z"
            fill="#fef08a"
          />
        </g>
      );
    case "gem":
      return (
        <g>
          <polygon points="32,1 40,8 32,17 24,8" fill="#06b6d4" opacity="0.95" />
          <polygon points="32,1 36,8 32,8 28,8" fill="#67e8f9" opacity="0.8" />
        </g>
      );
    case "cape":
      return (
        <g>
          <path d="M20 43 Q10 55 14 75 Q22 70 32 72 Q42 70 50 75 Q54 55 44 43 Q38 47 32 46 Q26 47 20 43 Z" fill="#dc2626" opacity="0.9" />
          <path d="M20 43 Q26 50 32 48 Q38 50 44 43" fill="none" stroke="#b91c1c" strokeWidth="1" />
        </g>
      );
    case "halo":
      return (
        <ellipse cx="32" cy="9" rx="13" ry="4" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.9" />
      );
    case "none":
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Avatar — a friendly flat-design chibi humanoid built from layered parts.
// ---------------------------------------------------------------------------

export default function Avatar({
  config,
  size = 48,
}: {
  config: AvatarConfig;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 80"
      role="img"
      aria-label="learner avatar"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Shoes */}
      <g fill={config.shoes}>
        <rect x="22" y="71" width="9" height="6" rx="3" />
        <rect x="33" y="71" width="9" height="6" rx="3" />
      </g>

      {/* 2. Pants / legs */}
      <g fill={config.pants}>
        <rect x="24" y="58" width="7" height="15" rx="3" />
        <rect x="33" y="58" width="7" height="15" rx="3" />
      </g>

      {/* 3. Torso / t-shirt with short sleeves */}
      <g fill={config.shirt}>
        {/* sleeves */}
        <rect x="14" y="42" width="9" height="12" rx="4" />
        <rect x="41" y="42" width="9" height="12" rx="4" />
        {/* body */}
        <path d="M22 43 Q32 39 42 43 L42 60 Q32 63 22 60 Z" />
      </g>

      {/* 4. Neck + head */}
      <rect x="29" y="36" width="6" height="7" rx="3" fill={config.skin} />
      <rect x="20" y="14" width="24" height="26" rx="12" fill={config.skin} />

      {/* 5. Face: two eyes and a small smile */}
      <g fill="#1f2937">
        <circle cx="27" cy="27" r="1.7" />
        <circle cx="37" cy="27" r="1.7" />
      </g>
      <path
        d="M28 32 Q32 35 36 32"
        fill="none"
        stroke="#1f2937"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* 6. Hair on top */}
      <Hair style={config.hair} color={config.hairColor} />

      {/* 7. Accessory (unlocked by level) */}
      {config.accessory && config.accessory !== "none" && (
        <Accessory id={config.accessory} />
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sensible default avatar for the customizer / new profiles.
// ---------------------------------------------------------------------------

export function randomAvatar(): AvatarConfig {
  return {
    skin: SKIN_TONES[0],
    hair: "short",
    hairColor: HAIR_COLORS[0],
    shirt: CLOTHING_COLORS[0],
    pants: CLOTHING_COLORS[6],
    shoes: CLOTHING_COLORS[7],
  };
}
