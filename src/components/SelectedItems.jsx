import {} from "react"; // ingen hooks nødvendige hvis useMemo fjernes
const colors = {
  run: "#FF6B6B",
  bike: "#4D96FF",
  swim: "#4DFFB8",
  strength: "#FFD93D",
};

const SelectedItems = ({ steps, currentStep }) => {
  const shown = steps
    ? steps
        .slice(0, currentStep)
        .filter((step) => step.kind === "traceback" && step.took)
        .map((step) => step.session)
    : [];
  return (
    <div style={{ marginTop: 25 }}>
      <h2>Valgte træningspas (Knapsack Resultat)</h2>
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          backgroundColor: "#000",
          borderRadius: 5,
          color: "#fff",
        }}
      >
        <strong>Total:</strong> {shown.length} pas |{" "}
        {shown.reduce((sum, s) => sum + s.durationHours, 0).toFixed(1)} timer |{" "}
        {shown.reduce((sum, s) => sum + s.value, 0)} points
      </div>
      {shown.length === 0 && (
        <div style={{ opacity: 0.6 }}>Intet valgt endnu…</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {shown.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: colors[s.type] || "#eee",
              padding: "12px 14px",
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "all 0.3s",
            }}
          >
            <div style={{ fontWeight: 600 }}>{s.type}</div>
            <div style={{ fontSize: 12 }}>
              {Math.round(s.durationHours * 60)} min
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.value} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SelectedItems;
