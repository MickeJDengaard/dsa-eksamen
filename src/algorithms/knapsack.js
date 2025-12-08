export const UNIT_HOURS = 0.25;

//Timer til units - så vi kan arbejde med heltal i DP-tabellen
export function hoursToUnits(hours) {
  return Math.round(hours / UNIT_HOURS);
}

//Konverterer units tilbage til timer
export function unitsToHours(units) {
  return units * UNIT_HOURS;
}

//Beregner optimal plan baseret på sessions og total kapacitet i timer
//Returnrerer DP-tabellen samt alle trin til visualisering
export function computeDPWithSteps(sessions, capacityHours) {
  const n = sessions.length; //Antal sessions
  const W = hoursToUnits(capacityHours); //Total kapactitet i units
  //Initialiserer DP-tabellen med størrelse (n+1) x (W+1)
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  let steps = [];
  let stepIndexMap = new Map();
  let stepCounter = 0;

  //Fylder DP-tabellen
  for (let i = 1; i <= n; i++) {
    const dur = hoursToUnits(sessions[i - 1].durationHours); //Sessionens varighed i units
    const val = sessions[i - 1].value ?? 0; //Sessionens værdi
    for (let w = 0; w <= W; w++) {
      if (dur <= w) {
        const skip = dp[i - 1][w]; //Værdi hvis sessionen ikke tages
        const take = dp[i - 1][w - dur] + val; //Værdi hvis sessionen tages
        dp[i][w] = Math.max(skip, take); //Vælg maksimum
        const decision = take > skip ? "take" : "skip"; //Beslutningstagning
        //Gemmer step til visualisering
        const step = {
          index: stepCounter,
          kind: "fill",
          i,
          w,
          newValue: dp[i][w],
          decision,
        };
        steps.push(step);
        stepIndexMap.set(`${i}-${w}`, stepCounter);
        stepCounter++;
      } else {
        dp[i][w] = dp[i - 1][w]; //Sessionen kan ikke tages pga. kapacitetsbegrænsning
        const step = {
          index: stepCounter,
          kind: "fill",
          i,
          w,
          newValue: dp[i][w],
          decision: "skip",
        };
        steps.push(step);
        stepIndexMap.set(`${i}-${w}`, stepCounter);
        stepCounter++;
      }
    }
  }

  //Traceback for at finde hvilke sessions der blev valgt
  let w = W;
  for (let i = n; i > 0; i--) {
    const dur = hoursToUnits(sessions[i - 1].durationHours);
    const val = sessions[i - 1].value ?? 0;
    const took = w >= dur && dp[i][w] === dp[i - 1][w - dur] + val; //Om sessionen blev valgt
    const tbStep = {
      index: stepCounter,
      kind: "traceback",
      i,
      w,
      took,
      activeCell: `${i}-${w}`,
      newW: took ? w - dur : w,
      session: sessions[i - 1],
    };
    steps.push(tbStep);
    stepIndexMap.set(`tb-${i}-${w}`, stepCounter);
    stepCounter++;
    if (took) w -= dur;
  }

  return { dp, steps, stepIndexMap, n, Wunits: W }; //Returnerer alt til videre brug
}

//Ekstract den konkrete plan fra DP-tabellen
export function extractPlanFromDP(dp, sessions, capacityHours) {
  const W = hoursToUnits(capacityHours);
  const n = sessions.length;
  const plan = [];
  let w = W;

  //Traceback for at finde hvilke sessions der blev valgt
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      //Hvis værdi ændres, blev sessionen valgt
      const session = { ...sessions[i - 1] };
      plan.push(session);
      w -= hoursToUnits(session.durationHours);
    }
  }

  const ordered = plan.reverse(); //Vend rækkefølgen, så de er i original rækkefølge

  //Fordel sessions på ugedage
  const days = [
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
  ];
  const maxHoursWeekdays = capacityHours / 5; //Maks timer per hverdag
  let dayIdx = 0;
  let dayHours = 0;

  for (const s of ordered) {
    if (dayHours + s.durationHours > maxHoursWeekdays && dayIdx < 4) {
      dayIdx++;
      dayHours = 0;
    } else if (dayHours + s.durationHours > maxHoursWeekdays && dayIdx >= 4) {
      if (dayIdx < 6) dayIdx++;
      dayHours = 0;
    }
    s.day = days[dayIdx] ?? days[days.length - 1]; //Tildel dag
    dayHours += s.durationHours;
  }

  return ordered; //Returnerer den endelige plan
}
