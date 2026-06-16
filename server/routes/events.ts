import { Router } from "express";
import { getStore } from "../redis";
import { channelFor, replayEvents } from "../events";

export const eventsRouter = Router();

// Server-Sent Events stream for one session. The client receives the full
// replayed history immediately, then live agent events. Fan-out is via Redis
// pub/sub, so this works correctly even with multiple web instances.
eventsRouter.get("/:id", async (req, res) => {
  const sessionId = req.params.id;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(": connected\n\n");

  const send = (payload: string) => res.write(`data: ${payload}\n\n`);

  // Replay history so a late client is fully caught up.
  for (const event of await replayEvents(sessionId)) {
    send(JSON.stringify(event));
  }

  const unsubscribe = await getStore().subscribe(channelFor(sessionId), send);

  // Heartbeat keeps proxies from closing an idle connection.
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    void unsubscribe();
    res.end();
  });
});
