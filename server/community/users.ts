import { nanoid } from "nanoid";
import { getStore } from "../redis";
import type { AvatarConfig, Cursus, LeaderboardEntry, UserProfile } from "../../shared/types";

// ---------------------------------------------------------------------------
// Lightweight, password-less accounts for the community layer (see ROADMAP.md).
// A userId is minted on profile creation and kept client-side — good enough for
// a hackathon/community PoC. Swap this module's storage for a real DB + auth
// later without touching the routes (they only call these functions).
//
// Backed by the same Store abstraction as the rest of the app (Redis or memory).
// ---------------------------------------------------------------------------

const ALL_USERS_KEY = "agora:users:all";
const keys = {
  user: (id: string) => `agora:user:${id}`,
  username: (u: string) => `agora:username:${u.toLowerCase()}`,
};

export interface CreateUserInput {
  username: string;
  displayName: string;
  cursus: Cursus;
  interests: string[];
  avatar: AvatarConfig;
}

export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  const store = getStore();
  const taken = await store.getJSON<string>(keys.username(input.username));
  if (taken) throw new Error("username already taken");

  const user: UserProfile = {
    id: nanoid(10),
    username: input.username,
    displayName: input.displayName || input.username,
    cursus: input.cursus,
    interests: input.interests,
    avatar: input.avatar,
    xp: 0,
    streak: 0,
    friends: [],
    createdAt: Date.now(),
  };

  await store.setJSON(keys.user(user.id), user);
  await store.setJSON(keys.username(input.username), user.id);
  await store.rpushCapped(ALL_USERS_KEY, user.id, 100_000);
  return user;
}

export async function getUser(id: string): Promise<UserProfile | null> {
  return getStore().getJSON<UserProfile>(keys.user(id));
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const id = await getStore().getJSON<string>(keys.username(username));
  return id ? getUser(id) : null;
}

// Mutual friendship by username.
export async function addFriend(userId: string, friendUsername: string): Promise<UserProfile> {
  const store = getStore();
  const user = await getUser(userId);
  const friend = await getUserByUsername(friendUsername);
  if (!user) throw new Error("user not found");
  if (!friend) throw new Error("friend not found");
  if (friend.id === user.id) throw new Error("cannot add yourself");

  if (!user.friends.includes(friend.username)) user.friends.push(friend.username);
  if (!friend.friends.includes(user.username)) friend.friends.push(user.username);
  await store.setJSON(keys.user(user.id), user);
  await store.setJSON(keys.user(friend.id), friend);
  return user;
}

export async function awardXp(userId: string, amount: number): Promise<number> {
  const store = getStore();
  const user = await getUser(userId);
  if (!user) throw new Error("user not found");
  user.xp = Math.max(0, user.xp + amount);
  await store.setJSON(keys.user(user.id), user);
  return user.xp;
}

// Naive leaderboard: load all users and sort by XP. Fine for a PoC; for scale,
// move to a Redis sorted set (ZADD/ZREVRANGE). See ROADMAP.md.
export async function leaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const store = getStore();
  const ids = await store.lrange(ALL_USERS_KEY, 0, -1);
  const users = (await Promise.all(ids.map((id) => getUser(id)))).filter(
    (u): u is UserProfile => u !== null,
  );
  return users
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limit)
    .map((u) => ({ username: u.username, displayName: u.displayName, avatar: u.avatar, xp: u.xp }));
}
