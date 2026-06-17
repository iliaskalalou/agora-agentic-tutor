import { useMemo } from "react";
import type { AgentEvent, AgentKind, Lesson, SessionState } from "../../shared/types";
import ConceptTrack from "./ConceptTrack";
import AgentRoster from "./AgentRoster";
import MetricsPanel from "./MetricsPanel";
import TutorPanel from "./TutorPanel";
import AssessmentPanel from "./AssessmentPanel";
import ActivityStream from "./ActivityStream";
import SummaryCard from "./SummaryCard";
import { cx } from "../util";

export default function ControlRoom({
  session,
  events,
  lesson,
  submitting,
  advanced,
  onAnswer,
  onRestart,
}: {
  session: SessionState;
  events: AgentEvent[];
  lesson: Lesson | null;
  submitting: boolean;
  advanced: boolean;
  onAnswer: (questionId: string, answer: number | string) => void;
  onRestart: () => void;
}) {
  const activeAgent = useMemo<AgentKind | null>(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].type !== "snapshot") return events[i].agent;
    }
    return null;
  }, [events]);

  const completed = session.status === "completed" && !!session.summary;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:px-6">
      <ConceptTrack session={session} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className={cx("space-y-4", advanced ? "lg:col-span-3" : "lg:col-span-4")}>
          {advanced && <AgentRoster activeAgent={activeAgent} status={session.status} />}
          <MetricsPanel session={session} />
        </div>

        <div className={cx("space-y-4", advanced ? "lg:col-span-5" : "lg:col-span-8")}>
          {completed && <SummaryCard summary={session.summary!} onRestart={onRestart} />}
          <TutorPanel lesson={lesson} />
          {!completed && <AssessmentPanel session={session} submitting={submitting} onAnswer={onAnswer} />}
        </div>

        {advanced && (
          <div className="lg:col-span-4">
            <ActivityStream events={events} />
          </div>
        )}
      </div>
    </div>
  );
}
