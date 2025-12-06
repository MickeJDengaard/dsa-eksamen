import React, { useState, useEffect, useMemo } from "react";
import SelectedItems from "./SelectedItems";

const colors = {
  run: "#FF6B6B",
  bike: "#4D96FF",
  swim: "#4DFFB8",
  strength: "#FFD93D",
};

const Cell = React.memo(({ value, isActive, visible }) => (
  <td
    style={{
      border: "1px solid #eee",
      padding: 6,
      width: 36,
      height: 28,
      textAlign: "center",
      backgroundColor: isActive ? "#FFD93D" : "#fff",
      color: visible ? "#000" : "#aaa",
      transition: "background-color 120ms",
      fontWeight: visible ? "normal" : "300",
    }}
  >
    {visible ? value : ""}
  </td>
));

const DPTable = ({ sessions, capacityHours, runId, onFinish }) => {
  const [dpData, setDpData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    if (!runId) return;
    setCurrentStep(0);
    setIsPlaying(true);
    import("../algorithms/knapsack").then(({ computeDPWithSteps }) => {
      setDpData(computeDPWithSteps(sessions, capacityHours));
    });
  }, [runId, sessions, capacityHours]);

  useEffect(() => {
    if (!dpData || !isPlaying) return;
    if (currentStep >= dpData.steps.length) {
      if (onFinish) onFinish();
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed);
    return () => clearTimeout(timer);
  }, [currentStep, dpData, isPlaying, speed, onFinish]);

  // Visibility map for steps & traceback
  const visibilityMap = useMemo(() => {
    if (!dpData) return new Map();
    const map = new Map();
    const { stepIndexMap, n, Wunits, steps } = dpData;
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= Wunits; w++) {
        const fillIdx = stepIndexMap.get(`${i}-${w}`);
        const isFillVisible = fillIdx != null && fillIdx < currentStep;
        const isFillActive = fillIdx === currentStep - 1;
        let isTraceVisible = false;
        let isTraceActive = false;
        for (let s = 0; s < currentStep; s++) {
          const step = steps[s];
          if (step.kind === "traceback" && step.activeCell === `${i}-${w}`) {
            isTraceVisible = true;
            if (s === currentStep - 1) isTraceActive = true;
          }
        }
        map.set(`${i}-${w}`, {
          visible: isFillVisible || isTraceVisible,
          isActive: isFillActive || isTraceActive,
        });
      }
    }
    return map;
  }, [currentStep, dpData]);

  if (!dpData) return null;

  const { dp, Wunits, steps } = dpData;
  const getCellProps = (i, w) => visibilityMap.get(`${i}-${w}`) || { visible: false, isActive: false };

  return (
    <div style={{ overflowX: "auto", marginTop: 18 }}>
      <h2>DP Visualization (15 min units)</h2>
      <div style={{ marginBottom: 12, display: "flex", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Speed: {speed} ms
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: 8, width: 150 }}
          />
        </label>
        <span>
          Progress: {Math.min(currentStep, steps.length)} / {steps.length}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: isPlaying ? "#FF6B6B" : "#4D96FF", color: "#fff", border: "none", borderRadius: 4, fontSize: 12 }}
          >
            {isPlaying ? "Stop Algoritme" : "Kør Algoritme"}
          </button>
          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(true); }}
            style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#FFD93D", color: "#333", border: "none", borderRadius: 4, fontSize: 12 }}
          >
            Reset
          </button>
          <button
            onClick={() => { setCurrentStep(steps.length); setIsPlaying(false); }}
            style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#4DFFB8", color: "#333", border: "none", borderRadius: 4, fontSize: 12 }}
          >
            Skip til slut
          </button>
        </div>
      </div>
      <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 6, position: "sticky", left: 0, backgroundColor: "#f5f5f5" }}>i\w</th>
            {Array.from({ length: Wunits + 1 }, (_, u) => (
              <th key={u} style={{ border: "1px solid #fff", padding: 6, minWidth: 28, backgroundColor: "#000" }}>
                {u % 4 === 0 ? `${u / 4}h` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #fff", padding: 6, position: "sticky", left: 0, backgroundColor: "#000", fontWeight: "bold" }}>{i}</td>
              {row.map((cell, w) => {
                const { isActive, visible } = getCellProps(i, w);
                return <Cell key={w} value={cell} isActive={isActive} visible={visible} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <SelectedItems steps={steps} currentStep={currentStep} />
    </div>
  );
};

export default DPTable;
