import { Counter } from "../models/Counter.js";

export async function generateRegId() {
  return Counter.getNextSequence("regId");
}
