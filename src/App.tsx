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
import ProfileSetup, { type Profile } from "./components/ProfileSetup";

const PROFILE_KEY = "agora.profile.v1";

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [info, setInfo] = useState<RuntimeInfo | null>(null);
  const [presets, setPresets] = useState<GoalPreset[]>([]);
  const [stats, setStats] = useState<AggregateStats | null>(null);

  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [editingProfile, setEditingProfile] = useState(false);

  const [session, setSession] = useState<SessionState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const refreshStats = useCallback(() => {
    api.stats().then((r) => setStats(r.stats)).catch(() => undefined);
  }, []);

  useEffect(() => {
    api.info().then(setInfo).catch(() => undefined);
    api.presets().then((r) => setPresets(r.presets)).catch(() => undefined);
    refreshStats();
  }, [refreshStats]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const saveProfile = useCallback((p: Profile) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch {
      /* ignore storage errors */
    }
    setProfile(p);
    setEditingProfile(false);
  }, []);

  const handleStart = useCallback(
    async (req: CreateSessionRequest) => {
      setStarting(true);
      try {
        const enriched: CreateSessionRequest = profile
          ? { ...req, learnerName: profile.name, interests: profile.interests, avatar: profile.avatar }
          : req;
        const { session: created } = await api.createSession(enriched);
        setEvents([]);
        setLesson(null);
        setSession(created);
      } catch (err) {
        console.error(err);
        alert("Could not start the session. Is the server running?");
      } finally {
        setStarting(false);
      }
    },
    [profile],
  );

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

  // Onboarding / profile editing takes over the whole screen.
  if (!profile || editingProfile) {
    return <ProfileSetup initial={profile} onDone={saveProfile} />;
  }

  return (
    <div className="min-h-full">
      <Header
        info={info}
        session={session}
        profile={profile}
        advanced={advanced}
        onToggleAdvanced={() => setAdvanced((v) => !v)}
        onEditProfile={() => setEditingProfile(true)}
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
        <GoalLauncher
          presets={presets}
          info={info}
          stats={stats}
          starting={starting}
          profileName={profile.name}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
