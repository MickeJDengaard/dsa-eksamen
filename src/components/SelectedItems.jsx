//Farver til visualisering af træningstyper
const colors = {
  run: "#f20000ff",
  bike: "#004ab1ff",
  swim: "#017f4cff",
  strength: "#d1a700ff",
};

const SelectedItems = ({ steps, currentStep }) => {
  //Udregner de valgte sessions baseret på knapsack-algoritmens traceback steps
  const shown = steps
    ? steps
        .slice(0, currentStep) //Kun de steps vi er nået til
        .filter((step) => step.kind === "traceback" && step.took) //Kun reelle valg i optimeringen
        .map((step) => step.session) //Ekstract session data
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
