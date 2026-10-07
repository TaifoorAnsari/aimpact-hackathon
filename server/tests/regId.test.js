import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Counter } from "../src/models/Counter.js";
import { generateRegId } from "../src/services/regId.js";
import { ENV } from "../src/config/env.js";

describe("Registration ID Atomic Generation Unit Test", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(ENV.MONGODB_URI);
    }
    // Clean test counter
    await Counter.deleteOne({ _id: "testRegId" });
  });

  after(async () => {
    await Counter.deleteOne({ _id: "testRegId" });
    await mongoose.connection.close();
  });

  it("generates sequential ID matching format AIM-2026-XXXX", async () => {
    const id1 = await Counter.getNextSequence("testRegId");
    assert.equal(id1, "AIM-2026-0001");

    const id2 = await Counter.getNextSequence("testRegId");
    assert.equal(id2, "AIM-2026-0002");
  });
});
