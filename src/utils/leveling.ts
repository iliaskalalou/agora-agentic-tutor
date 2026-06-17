import type { AccessoryId } from "../../shared/types";

// XP required to reach level n: 100 * n*(n+1)/2
// Level 1 = 100xp, Level 2 = 300xp, Level 3 = 600xp, Level 4 = 1000xp …
export const MAX_LEVEL = 12;

export function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  return 100 * (level * (level + 1)) / 2;
}

export function levelFromXp(xp: number): number {
  let level = 0;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  return level;
}

/** Progress within the current level: 0→1 */
export function levelProgress(xp: number): number {
  const level = levelFromXp(xp);
  if (level >= MAX_LEVEL) return 1;
  const start = xpForLevel(level);
  const end = xpForLevel(level + 1);
  return (xp - start) / (end - start);
}

export function xpToNextLevel(xp: number): number {
  const level = levelFromXp(xp);
  if (level >= MAX_LEVEL) return 0;
  return xpForLevel(level + 1) - xp;
}

export interface AccessoryUnlock {
  level: number;
  accessoryId: AccessoryId;
  label: string;
  emoji: string;
  description: string;
}

export const ACCESSORY_UNLOCKS: AccessoryUnlock[] = [
  { level: 1, accessoryId: "cap", emoji: "🧢", label: "Cap", description: "A classic to start with." },
  { level: 2, accessoryId: "star", emoji: "⭐", label: "Star", description: "You're starting to shine!" },
  { level: 3, accessoryId: "sword", emoji: "⚔️", label: "Sword", description: "The weapon of knowledge." },
  { level: 4, accessoryId: "graduation", emoji: "🎓", label: "Graduation cap", description: "Knowledge is earned." },
  { level: 5, accessoryId: "shield", emoji: "🛡️", label: "Shield", description: "Knowledge protects you." },
  { level: 6, accessoryId: "flame", emoji: "🔥", label: "Flame", description: "You're on fire!" },
  { level: 7, accessoryId: "tophat", emoji: "🎩", label: "Top hat", description: "Elegance and know-how." },
  { level: 8, accessoryId: "gem", emoji: "💎", label: "Gem", description: "Precious like your knowledge." },
  { level: 9, accessoryId: "wizard", emoji: "🧙", label: "Wizard hat", description: "The magic of learning." },
  { level: 10, accessoryId: "cape", emoji: "🦸", label: "Cape", description: "You're a learning hero." },
  { level: 11, accessoryId: "halo", emoji: "😇", label: "Halo", description: "Almost perfect." },
  { level: 12, accessoryId: "crown", emoji: "👑", label: "Crown", description: "You've reached absolute legend." },
];

/** Returns the accessory unlocked at a given level, or null. */
export function getUnlockAtLevel(level: number): AccessoryUnlock | null {
  return ACCESSORY_UNLOCKS.find((u) => u.level === level) ?? null;
}

/** Returns all accessories unlocked so far (xp-based). */
export function getUnlockedAccessories(xp: number): AccessoryId[] {
  const level = levelFromXp(xp);
  return ["none", ...ACCESSORY_UNLOCKS.filter((u) => u.level <= level).map((u) => u.accessoryId)];
}

/** XP earned for a completed session */
export function computeSessionXp(conceptsMastered: number, avgMastery: number): number {
  const base = conceptsMastered * 50;
  const bonus = avgMastery >= 0.8 ? Math.round(conceptsMastered * 20) : 0;
  return base + bonus;
}
