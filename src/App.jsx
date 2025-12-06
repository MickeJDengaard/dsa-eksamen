import { useState } from "react";
import Controls from "./components/Controls";
import DPTable from "./components/DPTable";
import { trainingSessions } from "./data/trainingSessions";

export default function App() {
  const [sessions, setSessions] = useState(trainingSessions);
  const [capacityHours, setCapacityHours] = useState(10);
  const [runId, setRunId] = useState(0);

  const handleRun = () => setRunId((r) => r + 1);

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <h1>Knapsack Training Planner</h1>
      <Controls
        sessions={sessions}
        capacityHours={capacityHours}
        onRun={handleRun}
        onCapacityChange={setCapacityHours}
        onSessionValueChange={(id, newValue) =>
          setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, value: newValue } : s))
          )
        }
      />
      <DPTable
        sessions={sessions}
        capacityHours={capacityHours}
        runId={runId}
      />
    </div>
  );
}
