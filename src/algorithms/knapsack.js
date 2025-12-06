export const UNIT_HOURS = 0.25;

export function hoursToUnits(hours) {
  return Math.round(hours / UNIT_HOURS);
}

export function unitsToHours(units) {
  return units * UNIT_HOURS;
}

export function computeDPWithSteps(sessions, capacityHours) {
  const n = sessions.length;
  const W = hoursToUnits(capacityHours);
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  let steps = [];
  let stepIndexMap = new Map();
  let stepCounter = 0;

  for (let i = 1; i <= n; i++) {
    const dur = hoursToUnits(sessions[i - 1].durationHours);
    const val = sessions[i - 1].value;
    for (let w = 0; w <= W; w++) {
      if (dur <= w) {
        const skip = dp[i - 1][w];
        const take = dp[i - 1][w - dur] + val;
        dp[i][w] = Math.max(skip, take);
        const decision = take > skip ? "take" : "skip";
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
        dp[i][w] = dp[i - 1][w];
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

  let w = W;
  for (let i = n; i > 0; i--) {
    const dur = hoursToUnits(sessions[i - 1].durationHours);
    const val = sessions[i - 1].value ?? 0;
    const took = w >= dur && dp[i][w] === dp[i - 1][w - dur] + val;
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

  return { dp, steps, stepIndexMap, n, Wunits: W };
}

export function extractPlanFromDP(dp, sessions, capacityHours) {
  const W = hoursToUnits(capacityHours);
  const n = sessions.length;
  const plan = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const session = { ...sessions[i - 1] };
      plan.push(session);
      w -= hoursToUnits(session.durationHours);
      if (w < 0) w = 0;
    }
  }

  const ordered = plan.reverse();
  const days = [
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
  ];
  const maxHoursWeekdays = capacityHours / 5;
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
    s.day = days[dayIdx] ?? days[days.length - 1];
    dayHours += s.durationHours;
  }

  return ordered;
}
