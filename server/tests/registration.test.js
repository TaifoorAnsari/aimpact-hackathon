import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/index.js";
import { connectDB } from "../src/config/db.js";
import { Registration } from "../src/models/Registration.js";
import { Counter } from "../src/models/Counter.js";

describe("Registration API Integration Tests", () => {
  before(async () => {
    process.env.NODE_ENV = "test";
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    // Clean test records
    await Registration.deleteMany({ teamNameKey: { $in: ["testteamalpha", "testteambeta"] } });
  });

  after(async () => {
    await Registration.deleteMany({ teamNameKey: { $in: ["testteamalpha", "testteambeta"] } });
    await mongoose.connection.close();
  });

  const payload = {
    teamName: "TestTeamAlpha",
    track: "ai-education",
    teamSize: 2,
    idea: "Integration testing with supertest",
    pptUrl: "https://drive.google.com/file/d/test-pitch-deck/view",
    demoVideoUrl: "https://drive.google.com/file/d/test-demo-video/view",
    members: [
      {
        name: "Test Leader",
        email: "test.leader@apsit.edu.in",
        phone: "9988776655",
        college: "A.P. Shah Institute of Technology",
        department: "Artificial Intelligence & Machine Learning",
        year: "TE",
        isLeader: true,
      },
      {
        name: "Test Member",
        email: "test.member@apsit.edu.in",
        phone: "9988776644",
        college: "A.P. Shah Institute of Technology",
        department: "Computer Engineering",
        year: "TE",
        isLeader: false,
      },
    ],
    consent: {
      codeOfConduct: true,
      updates: true,
    },
    website_hp: "",
    formStartedAt: Date.now() - 6000,
  };

  it("POST /api/registrations - successfully registers a new team", async () => {
    const res = await request(app)
      .post("/api/registrations")
      .send(payload)
      .expect(201);

    assert.equal(res.body.success, true);
    assert.match(res.body.regId, /^AIM-2026-\d{4}$/);
    assert.equal(res.body.teamName, "TestTeamAlpha");
    assert.equal(res.body.status, "confirmed");
    assert.equal(res.body.pptUrl, payload.pptUrl);
    assert.equal(res.body.demoVideoUrl, payload.demoVideoUrl);
  });

  it("POST /api/registrations - rejects submission without compulsory PPT link", async () => {
    const invalidPayload = { ...payload, teamName: "TestTeamNoPPT" };
    delete invalidPayload.pptUrl;

    const res = await request(app)
      .post("/api/registrations")
      .send(invalidPayload)
      .expect(400);

    assert.equal(res.body.error.code, "VALIDATION_ERROR");
  });

  it("POST /api/registrations - rejects duplicate team name", async () => {
    const res = await request(app)
      .post("/api/registrations")
      .send({
        ...payload,
        members: [
          { ...payload.members[0], email: "different.email1@apsit.edu.in", phone: "9876500001" },
          { ...payload.members[1], email: "different.email2@apsit.edu.in", phone: "9876500002" },
        ],
      })
      .expect(409);

    assert.equal(res.body.error.code, "DUPLICATE_TEAM_NAME");
  });

  it("POST /api/registrations - rejects duplicate email across teams", async () => {
    const res = await request(app)
      .post("/api/registrations")
      .send({
        ...payload,
        teamName: "TestTeamBeta",
        members: [
          { ...payload.members[0], email: "test.leader@apsit.edu.in", phone: "9876500003" }, // duplicate email
          { ...payload.members[1], email: "different.email3@apsit.edu.in", phone: "9876500004" },
        ],
      })
      .expect(409);

    assert.equal(res.body.error.code, "DUPLICATE_EMAIL");
  });

  it("GET /api/stats - returns public stats", async () => {
    const res = await request(app).get("/api/stats").expect(200);

    assert.ok(typeof res.body.total === "number");
    assert.ok(typeof res.body.spotsLeft === "number");
    assert.equal(res.body.capacity, 150);
  });

  it("GET /api/admin/export.xlsx - exports valid Excel workbook", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const { ENV } = await import("../src/config/env.js");
    const token = jwt.sign({ id: "test-admin", role: "lead_organizer" }, ENV.JWT_SECRET);

    const res = await request(app)
      .get("/api/admin/export.xlsx")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.equal(
      res.headers["content-type"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    assert.ok(res.headers["content-disposition"]?.includes(".xlsx"));
    assert.ok(parseInt(res.headers["content-length"], 10) > 0);
  });
});
