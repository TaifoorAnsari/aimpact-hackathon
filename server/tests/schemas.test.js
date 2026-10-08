import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { registrationValidationSchema } from "../src/middleware/validate.js";

describe("Registration Zod Schema Unit Tests", () => {
  const validSubmission = {
    teamName: "NeuralSquad",
    track: "ai-education",
    teamSize: 2,
    idea: "Autonomous agent for multimodal health analytics",
    members: [
      {
        name: "Aarav Sharma",
        email: "aarav@apsit.edu.in",
        phone: "9876543210",
        college: "A.P. Shah Institute of Technology",
        department: "Artificial Intelligence & Machine Learning",
        year: "TE",
        isLeader: true,
      },
      {
        name: "Riya Patel",
        email: "riya@apsit.edu.in",
        phone: "9812345678",
        college: "A.P. Shah Institute of Technology",
        department: "Computer Engineering",
        year: "TE",
        isLeader: false,
      },
    ],
    pptUrl: "https://drive.google.com/test-pitch",
    consent: {
      codeOfConduct: true,
      updates: true,
    },
    website_hp: "",
    formStartedAt: Date.now() - 5000,
  };

  it("passes for valid team registration", () => {
    const result = registrationValidationSchema.safeParse(validSubmission);
    assert.equal(result.success, true);
  });

  it("fails if teamName is under 3 characters", () => {
    const invalid = { ...validSubmission, teamName: "AB" };
    const result = registrationValidationSchema.safeParse(invalid);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes("teamName")));
  });

  it("passes for valid team registration with AI for Healthcare track", () => {
    const healthSubmission = { ...validSubmission, track: "ai-healthcare" };
    const result = registrationValidationSchema.safeParse(healthSubmission);
    assert.equal(result.success, true);
  });

  it("fails if invalid track is provided", () => {
    const invalid = { ...validSubmission, track: "quantum-blockchain" };
    const result = registrationValidationSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it("fails if member phone is not a valid 10-digit Indian mobile number", () => {
    const invalid = {
      ...validSubmission,
      members: [
        { ...validSubmission.members[0], phone: "12345" },
        validSubmission.members[1],
      ],
    };
    const result = registrationValidationSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it("fails if members array length does not match teamSize", () => {
    const invalid = { ...validSubmission, teamSize: 3 }; // only 2 members provided
    const result = registrationValidationSchema.safeParse(invalid);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes("members")));
  });

  it("fails if internal duplicate email is present within the team", () => {
    const invalid = {
      ...validSubmission,
      members: [
        validSubmission.members[0],
        { ...validSubmission.members[1], email: "aarav@apsit.edu.in" }, // same email as leader
      ],
    };
    const result = registrationValidationSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});
