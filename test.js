import { knapsack } from "./src/algorithms/knapsack.js";

const sessions = [
  { id: 1, duration: 30, value: 10 },
  { id: 2, duration: 60, value: 25 },
  { id: 3, duration: 45, value: 15 },
];

const result = knapsack(sessions, 130);
console.log(result);
