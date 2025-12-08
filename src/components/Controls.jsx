//Komponent der håndterer kapactitet, session values og kørsel af knapsack algoritmen

const Controls = ({
  sessions, //Liste af sessions
  capacityHours, //Maks ugentlig kapacitet i timer
  onRun, //Funktion til at køre knapsack algoritmen
  onCapacityChange, //Funktion til at ændre kapacitet
  onSessionValueChange, //Funktion til at ændre session value
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Controls</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Maks træningstid pr. uge: {capacityHours} timer
          <input
            type="range"
            min="2"
            max="20"
            step="0.5"
            value={capacityHours}
            onChange={(e) => onCapacityChange(Number(e.target.value))}
            aria-label="Maksimal træningstid per uge"
            aria-valuemin="2"
            aria-valuemax="20"
            aria-valuenow={capacityHours}
            style={{ marginLeft: 10, width: 320 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <h3>Sessions (duration i timer)</h3>
        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              marginBottom: 6,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div style={{ width: 160 }}>
              {s.type} — {s.durationHours}h
            </div>
            <label style={{ fontSize: 13 }}>
              Points:
              <input
                type="number"
                value={s.value}
                min="0"
                max="100"
                onChange={(e) =>
                  onSessionValueChange(s.id, Number(e.target.value))
                }
                aria-label={`Points for ${s.type} session`}
                style={{ width: 70, marginLeft: 8 }}
              />
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={() => onRun(sessions, capacityHours)}
        style={{
          padding: "10px 18px",
          fontSize: 14,
          cursor: "pointer",
          backgroundColor: "#4D96FF",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        aria-label="Kør knapsack algoritme"
      >
        Kør Knapsack
      </button>
    </div>
  );
};
export default Controls;
