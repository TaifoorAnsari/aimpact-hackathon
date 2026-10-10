import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, enum: ["SE", "TE"] },
    isLeader: { type: Boolean, default: false },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    diet: { type: String, enum: ["veg", "non-veg"], default: "veg" },
    tshirt: { type: String, enum: ["S", "M", "L", "XL", "XXL"], default: "L" },
  },
  { _id: true }
);

const registrationSchema = new mongoose.Schema(
  {
    regId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    teamNameKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    track: {
      type: String,
      required: true,
      enum: ["ai-education", "ai-healthcare", "ai-ml", "healthtech", "web-iot"],
      index: true,
    },
    idea: {
      type: String,
      trim: true,
      maxlength: 140,
    },
    pptUrl: {
      type: String,
      required: [true, "Presentation / Pitch Deck link is required"],
      trim: true,
    },
    demoVideoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 3 && v.length <= 4;
        },
        message: "A team must have between 3 and 4 members.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "waitlisted", "cancelled"],
      default: "confirmed",
      index: true,
    },
    payment: {
      required: { type: Boolean, default: false },
      orderId: { type: String },
      paymentId: { type: String },
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ["pending", "captured", "failed", "na"], default: "na" },
    },
    consent: {
      codeOfConduct: { type: Boolean, required: true },
      updates: { type: Boolean, required: true },
      at: { type: Date, default: Date.now },
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    source: {
      type: String,
    },
    ip: {
      type: String, // SHA-256 hashed
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Unique multikey index on members.email and members.phone
registrationSchema.index({ "members.email": 1 }, { unique: true });
registrationSchema.index({ "members.phone": 1 }, { unique: true });

// Compound index for queries and sorting
registrationSchema.index({ status: 1, track: 1, createdAt: -1 });

export const Registration = mongoose.model("Registration", registrationSchema);
