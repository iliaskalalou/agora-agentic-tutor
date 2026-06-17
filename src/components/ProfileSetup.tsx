import { useState } from "react";
import type { AvatarConfig } from "../../shared/types";
import Avatar, { AVATAR_CREATURES, AVATAR_COLORS } from "./Avatar";
import { cx } from "../util";

export interface Profile {
  name: string;
  interests: string[];
  avatar: AvatarConfig;
}

const SUGGESTED = [
  "Football",
  "Space",
  "Gaming",
  "Animals",
  "Music",
  "Art",
  "Dinosaurs",
  "Cars",
  "Cooking",
  "Superheroes",
  "Nature",
  "Science",
];

export default function ProfileSetup({
  initial,
  onDone,
}: {
  initial?: Profile | null;
  onDone: (p: Profile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [creature, setCreature] = useState(initial?.avatar.creature ?? "fox");
  const [color, setColor] = useState(initial?.avatar.color ?? AVATAR_COLORS[0]);
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [custom, setCustom] = useState("");

  const avatar: AvatarConfig = { creature, color };

  const toggle = (tag: string) =>
    setInterests((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const addCustom = () => {
    const v = custom.trim();
    if (v && !interests.includes(v) && interests.length < 10) setInterests((c) => [...c, v]);
    setCustom("");
  };

  const valid = name.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Create your learner
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your buddy follows you everywhere, and your exercises get themed around what you love.
        </p>
      </div>

      <div className="panel panel-pad space-y-6">
        {/* Preview + name */}
        <div className="flex items-center gap-4">
          <Avatar config={avatar} size={64} />
          <div className="flex-1">
            <label className="label">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Buddy */}
        <div>
          <div className="label mb-2">Pick your buddy</div>
          <div className="flex gap-3">
            {AVATAR_CREATURES.map((c) => (
              <button
                key={c}
                onClick={() => setCreature(c)}
                className={cx(
                  "rounded-xl border p-2 transition",
                  creature === c ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:bg-slate-50",
                )}
                aria-label={c}
              >
                <Avatar config={{ creature: c, color }} size={44} />
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <div className="label mb-2">Pick a color</div>
          <div className="flex gap-2">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cx("h-8 w-8 rounded-full ring-2 ring-offset-2 transition", color === c ? "ring-slate-400" : "ring-transparent")}
                style={{ background: c }}
                aria-label={`color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <div className="label mb-2">What do you like? (themes your exercises)</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((tag) => (
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
          {interests.filter((t) => !SUGGESTED.includes(t)).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {interests
                .filter((t) => !SUGGESTED.includes(t))
                .map((t) => (
                  <button key={t} onClick={() => toggle(t)} className="chip bg-brand-50 text-brand-700">
                    {t} ✕
                  </button>
                ))}
            </div>
          )}
        </div>

        <button className="btn-primary w-full" disabled={!valid} onClick={() => onDone({ name: name.trim(), interests, avatar })}>
          {initial ? "Save" : "Start learning"}
        </button>
      </div>
    </div>
  );
}
