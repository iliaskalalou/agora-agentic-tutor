import { useState } from "react";
import type { AccessoryId, AvatarConfig, Cursus, HairStyle } from "../../shared/types";
import { NIVEAUX } from "../../shared/types";
import Avatar, { HAIR_STYLES, SKIN_TONES, HAIR_COLORS, CLOTHING_COLORS, randomAvatar } from "./Avatar";
import { ACCESSORY_UNLOCKS, getUnlockedAccessories } from "../utils/leveling";
import { cx } from "../util";

export interface Profile {
  name: string;
  cursus: Cursus;
  niveau: string;
  interests: string[];
  avatar: AvatarConfig;
  xp: number;
}

const SUGGESTED = [
  "Football",
  "Space",
  "Gaming",
  "Animals",
  "Music",
  "Drawing",
  "Dinosaurs",
  "Cars",
  "Cooking",
  "Superheroes",
  "Nature",
  "Science",
];

const HAIR_LABEL: Record<HairStyle, string> = {
  short: "Short",
  long: "Long",
  buzz: "Buzz",
  ponytail: "Ponytail",
  curly: "Curly",
  bald: "Bald",
};

function Swatches({
  values,
  selected,
  onPick,
  round = true,
}: {
  values: string[];
  selected: string;
  onPick: (v: string) => void;
  round?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className={cx(
            "h-7 w-7 ring-2 ring-offset-2 transition",
            round ? "rounded-full" : "rounded-md",
            selected === v ? "ring-slate-400" : "ring-transparent",
          )}
          style={{ background: v }}
          aria-label={v}
        />
      ))}
    </div>
  );
}

export default function ProfileSetup({
  initial,
  onDone,
}: {
  initial?: Profile | null;
  onDone: (p: Profile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [cursus, setCursus] = useState<Cursus>(initial?.cursus ?? "college");
  const [niveau, setNiveau] = useState<string>(initial?.niveau ?? NIVEAUX[initial?.cursus ?? "college"][0]);
  const [avatar, setAvatar] = useState<AvatarConfig>(initial?.avatar ?? randomAvatar());
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [custom, setCustom] = useState("");

  const xp = initial?.xp ?? 0;
  const unlockedAccessories = getUnlockedAccessories(xp);

  const changeCursus = (c: Cursus) => {
    setCursus(c);
    setNiveau(NIVEAUX[c][0]);
  };

  const set = (patch: Partial<AvatarConfig>) => setAvatar((a) => ({ ...a, ...patch }));

  const toggle = (tag: string) =>
    setInterests((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const addCustom = () => {
    const v = custom.trim();
    if (v && !interests.includes(v) && interests.length < 10) setInterests((c) => [...c, v]);
    setCustom("");
  };

  const valid = name.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Create your profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your avatar follows you everywhere, and your exercises adapt to what you love.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        {/* Live preview */}
        <div className="panel panel-pad flex flex-col items-center justify-center gap-3">
          <Avatar config={avatar} size={150} />
          <div className="text-center">
            <div className="font-semibold text-slate-900">{name.trim() || "Your name"}</div>
            <div className="text-xs text-slate-400">
              {cursus === "college" ? "Middle school" : "High school"} · {niveau}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="panel panel-pad space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Your first name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="label">School level</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(["college", "lycee"] as Cursus[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => changeCursus(c)}
                    className={cx(
                      "rounded-lg border px-3 py-2 text-sm font-semibold transition",
                      cursus === c ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    {c === "college" ? "Middle school" : "High school"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grade */}
          <div>
            <div className="label mb-2">Grade</div>
            <div className="flex flex-wrap gap-2">
              {NIVEAUX[cursus].map((n) => (
                <button
                  key={n}
                  onClick={() => setNiveau(n)}
                  className={cx(
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition",
                    niveau === n ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 hover:bg-slate-50",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Hair style */}
          <div>
            <div className="label mb-2">Hairstyle</div>
            <div className="flex flex-wrap gap-2">
              {HAIR_STYLES.map((h) => (
                <button
                  key={h}
                  onClick={() => set({ hair: h })}
                  className={cx(
                    "flex flex-col items-center gap-1 rounded-lg border p-1.5 transition",
                    avatar.hair === h ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:bg-slate-50",
                  )}
                >
                  <Avatar config={{ ...avatar, hair: h }} size={40} />
                  <span className="text-[10px] text-slate-500">{HAIR_LABEL[h]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="label mb-2">Skin</div>
              <Swatches values={SKIN_TONES} selected={avatar.skin} onPick={(v) => set({ skin: v })} />
            </div>
            <div>
              <div className="label mb-2">Hair color</div>
              <Swatches values={HAIR_COLORS} selected={avatar.hairColor} onPick={(v) => set({ hairColor: v })} />
            </div>
            <div>
              <div className="label mb-2">T-shirt</div>
              <Swatches values={CLOTHING_COLORS} selected={avatar.shirt} onPick={(v) => set({ shirt: v })} round={false} />
            </div>
            <div>
              <div className="label mb-2">Pants</div>
              <Swatches values={CLOTHING_COLORS} selected={avatar.pants} onPick={(v) => set({ pants: v })} round={false} />
            </div>
            <div>
              <div className="label mb-2">Shoes</div>
              <Swatches values={CLOTHING_COLORS} selected={avatar.shoes} onPick={(v) => set({ shoes: v })} round={false} />
            </div>
          </div>

          {/* Accessory (unlocked by level) */}
          <div>
            <div className="label mb-2">Accessory</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => set({ accessory: "none" as AccessoryId })}
                className={cx(
                  "flex flex-col items-center gap-1 rounded-lg border p-1.5 transition",
                  (avatar.accessory ?? "none") === "none"
                    ? "border-brand-400 bg-brand-50"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <Avatar config={{ ...avatar, accessory: "none" }} size={40} />
                <span className="text-[10px] text-slate-500">None</span>
              </button>

              {ACCESSORY_UNLOCKS.map((unlock) => {
                const isUnlocked = unlockedAccessories.includes(unlock.accessoryId);
                return (
                  <button
                    key={unlock.accessoryId}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && set({ accessory: unlock.accessoryId })}
                    title={isUnlocked ? unlock.label : `Unlocks at level ${unlock.level}`}
                    className={cx(
                      "flex flex-col items-center gap-1 rounded-lg border p-1.5 transition",
                      !isUnlocked && "cursor-not-allowed opacity-40 grayscale",
                      isUnlocked && avatar.accessory === unlock.accessoryId
                        ? "border-brand-400 bg-brand-50"
                        : isUnlocked
                          ? "border-slate-200 hover:bg-slate-50"
                          : "border-slate-200",
                    )}
                  >
                    <Avatar config={{ ...avatar, accessory: isUnlocked ? unlock.accessoryId : "none" }} size={40} />
                    <span className="text-[10px] text-slate-500">{isUnlocked ? unlock.label : `Lv.${unlock.level}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="label mb-2">Your interests</div>
            <div className="flex flex-wrap gap-2">
              {[...SUGGESTED, ...interests.filter((t) => !SUGGESTED.includes(t))].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className={cx(
                    "chip border transition",
                    interests.includes(tag)
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {tag}
                  {interests.includes(tag) && !SUGGESTED.includes(tag) ? " ✕" : ""}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Add your own…"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button className="btn-ghost !px-3" onClick={addCustom}>
                Add
              </button>
            </div>
          </div>

          <button
            className="btn-primary w-full"
            disabled={!valid}
            onClick={() => onDone({ name: name.trim(), cursus, niveau, interests, avatar, xp })}
          >
            {initial ? "Save" : "Get started"}
          </button>
        </div>
      </div>
    </div>
  );
}
