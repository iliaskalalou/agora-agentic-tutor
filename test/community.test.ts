import { describe, it, expect, beforeAll } from "vitest";
import { initStore } from "../server/redis";
import { createUser, getUser, addFriend, awardXp, leaderboard } from "../server/community/users";
import type { AvatarConfig } from "../shared/types";

const avatar: AvatarConfig = {
  skin: "#f1c27d",
  hair: "short",
  hairColor: "#1f2937",
  shirt: "#4f46e5",
  pants: "#334155",
  shoes: "#f43f5e",
};

beforeAll(async () => {
  await initStore();
});

describe("community accounts", () => {
  it("creates a user, enforces unique usernames, befriends, and ranks by XP", async () => {
    const a = await createUser({ username: "alex", displayName: "Alex", cursus: "college", interests: [], avatar });
    const b = await createUser({ username: "sam", displayName: "Sam", cursus: "lycee", interests: [], avatar });
    expect(a.id).toBeTruthy();
    expect((await getUser(a.id))?.username).toBe("alex");

    // Username uniqueness.
    await expect(createUser({ username: "alex", displayName: "x", cursus: "college", interests: [], avatar })).rejects.toThrow();

    // Mutual friendship.
    const updated = await addFriend(a.id, "sam");
    expect(updated.friends).toContain("sam");
    expect((await getUser(b.id))?.friends).toContain("alex");

    // XP + leaderboard ordering.
    await awardXp(b.id, 50);
    await awardXp(a.id, 10);
    const board = await leaderboard(10);
    const sam = board.findIndex((e) => e.username === "sam");
    const alex = board.findIndex((e) => e.username === "alex");
    expect(sam).toBeGreaterThanOrEqual(0);
    expect(sam).toBeLessThan(alex);
  });
});
