import { useCallback, useEffect, useState } from "react";
import type {
  AgentEvent,
  AggregateStats,
  CreateSessionRequest,
  GoalPreset,
  Lesson,
  SessionState,
} from "../shared/types";
import { api, streamSession, type RuntimeInfo } from "./api";
import Header from "./components/Header";
import GoalLauncher from "./components/GoalLauncher";
import ControlRoom from "./components/ControlRoom";

export default function App() {
  const [info, setInfo] = useState<RuntimeInfo | null>(null);
  const [presets, setPresets] = useState<GoalPreset[]>([]);
  const [stats, setStats] = useState<AggregateStats | null>(null);

  const [session, setSession] = useState<SessionState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Default to the clean student view; "Coach view" reveals the AI agents.
  const [advanced, setAdvanced] = useState(false);

  const refreshStats = useCallback(() => {
    api.stats().then((r) => setStats(r.stats)).catch(() => undefined);
  }, []);

  useEffect(() => {
    api.info().then(setInfo).catch(() => undefined);
    api.presets().then((r) => setPresets(r.presets)).catch(() => undefined);
    refreshStats();
  }, [refreshStats]);

  // Subscribe to the live event stream whenever we have an active session.
  useEffect(() => {
    if (!session?.id) return;
    const close = streamSession(session.id, (e) => {
      if (e.type === "snapshot") {
        const next = e.data?.session as SessionState | undefined;
        if (next) setSession((prev) => (prev && prev.id === next.id ? next : prev));
        return;
      }
      setEvents((prev) => [...prev, e]);
      if (e.type === "lesson" && e.data?.lesson) setLesson(e.data.lesson as Lesson);
      if (e.type === "run.complete") refreshStats();
    });
    return close;
    // Re-subscribe only when the session identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const handleStart = useCallback(async (req: CreateSessionRequest) => {
    setStarting(true);
    try {
      const { session: created } = await api.createSession(req);
      setEvents([]);
      setLesson(null);
      setSession(created);
    } catch (err) {
      console.error(err);
      alert("Could not start the session. Is the server running?");
    } finally {
      setStarting(false);
    }
  }, []);

  const handleAnswer = useCallback(
    async (questionId: string, answer: number | string) => {
      if (!session) return;
      setSubmitting(true);
      try {
        await api.answer(session.id, questionId, answer);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [session],
  );

  const handleRestart = useCallback(() => {
    setSession(null);
    setEvents([]);
    setLesson(null);
    refreshStats();
  }, [refreshStats]);

  return (
    <div className="min-h-full">
      <Header
        info={info}
        session={session}
        advanced={advanced}
        onToggleAdvanced={() => setAdvanced((v) => !v)}
        onRestart={session ? handleRestart : undefined}
      />
      {session ? (
        <ControlRoom
          session={session}
          events={events}
          lesson={lesson}
          submitting={submitting}
          advanced={advanced}
          onAnswer={handleAnswer}
          onRestart={handleRestart}
        />
      ) : (
        <GoalLauncher presets={presets} info={info} stats={stats} starting={starting} onStart={handleStart} />
      )}
    </div>
  );
}
