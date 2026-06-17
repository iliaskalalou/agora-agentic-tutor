import { Router } from "express";
import { z } from "zod";
import { createUser, getUser, addFriend, awardXp, leaderboard } from "../community/users";

export const communityRouter = Router();

const avatarSchema = z.object({
  skin: z.string().max(16),
  hair: z.enum(["short", "long", "buzz", "ponytail", "curly", "bald"]),
  hairColor: z.string().max(16),
  shirt: z.string().max(16),
  pants: z.string().max(16),
  shoes: z.string().max(16),
});

const createSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "letters, numbers and underscores only"),
  displayName: z.string().trim().max(40).optional(),
  cursus: z.enum(["college", "lycee"]),
  interests: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  avatar: avatarSchema,
});

communityRouter.post("/users", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid request", details: parsed.error.flatten() });
  try {
    const user = await createUser({ ...parsed.data, displayName: parsed.data.displayName ?? parsed.data.username });
    res.status(201).json({ user });
  } catch (err) {
    res.status(409).json({ error: (err as Error).message });
  }
});

communityRouter.get("/users/:id", async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user });
});

communityRouter.post("/users/:id/friends", async (req, res) => {
  const username = z.string().trim().min(2).max(20).safeParse(req.body?.username);
  if (!username.success) return res.status(400).json({ error: "username required" });
  try {
    const user = await addFriend(req.params.id, username.data);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

communityRouter.post("/users/:id/xp", async (req, res) => {
  const amount = z.coerce.number().int().min(-1000).max(1000).safeParse(req.body?.amount);
  if (!amount.success) return res.status(400).json({ error: "amount must be an integer" });
  try {
    const xp = await awardXp(req.params.id, amount.data);
    res.json({ xp });
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});

communityRouter.get("/leaderboard", async (_req, res) => {
  res.json({ entries: await leaderboard(20) });
});
