import { z } from "zod";

const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => indianPhoneRegex.test(val), {
      message: "Please enter a valid 10-digit Indian mobile number",
    }),
  college: z.string().trim().min(2, "College name is required").max(120),
  department: z.string().trim().min(2, "Department is required").max(80),
  year: z.enum(["FE", "SE", "TE", "BE"], {
    errorMap: () => ({ message: "Select a valid academic year (FE, SE, TE, or BE)" }),
  }),
  isLeader: z.boolean().default(false),
  github: z.string().trim().optional().or(z.literal("")),
  linkedin: z.string().trim().optional().or(z.literal("")),
  diet: z.enum(["veg", "non-veg"]).optional().default("veg"),
  tshirt: z.enum(["S", "M", "L", "XL", "XXL"]).optional().default("L"),
});

export const registrationValidationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, "Team name must be at least 3 characters")
      .max(40, "Team name cannot exceed 40 characters"),
    track: z.enum(["ai-education", "ai-healthcare"], {
      errorMap: () => ({ message: "Please select a valid hackathon track (AI for Education or AI for Healthcare)" }),
    }),
    teamSize: z.coerce.number().min(2, "Minimum team size is 2").max(4, "Maximum team size is 4"),
    idea: z.string().trim().max(140, "Idea summary cannot exceed 140 characters").optional().or(z.literal("")),
    pptUrl: z
      .string({ required_error: "Presentation / Pitch Deck link is required" })
      .trim()
      .min(1, "Presentation / Pitch Deck link is required")
      .transform((val) => (val && !val.match(/^https?:\/\//i) ? `https://${val}` : val))
      .refine(
        (val) => {
          try {
            const url = new URL(val);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        { message: "Please provide a valid URL for your PPT / Pitch Deck (e.g. Google Drive link)" }
      ),
    demoVideoUrl: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val && !val.match(/^https?:\/\//i) ? `https://${val}` : val || ""))
      .refine(
        (val) => {
          if (!val) return true;
          try {
            const url = new URL(val);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        { message: "Please provide a valid URL for your prototype demo video" }
      ),
    members: z.array(memberSchema).min(2, "At least 2 members are required").max(4, "Maximum 4 members allowed"),
    consent: z.object({
      codeOfConduct: z.literal(true, {
        errorMap: () => ({ message: "You must accept the Code of Conduct" }),
      }),
      updates: z.literal(true, {
        errorMap: () => ({ message: "You must consent to event updates" }),
      }),
    }),
    website_hp: z.string().optional(), // Honeypot field
    formStartedAt: z.coerce.number().optional(), // Timing check
  })
  .superRefine((data, ctx) => {
    if (data.members.length !== data.teamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Number of members provided (${data.members.length}) does not match team size (${data.teamSize})`,
        path: ["members"],
      });
    }

    // Check duplicate emails or phones within the submitted team
    const emails = new Set();
    const phones = new Set();

    data.members.forEach((m, idx) => {
      const normalizedEmail = m.email.toLowerCase();
      const normalizedPhone = m.phone.replace(/^(?:\+91|91|0)/, "");

      if (emails.has(normalizedEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate email "${m.email}" inside this team roster.`,
          path: ["members", idx, "email"],
        });
      }
      emails.add(normalizedEmail);

      if (phones.has(normalizedPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate phone number "${m.phone}" inside this team roster.`,
          path: ["members", idx, "phone"],
        });
      }
      phones.add(normalizedPhone);
    });
  });

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fields[path] = issue.message;
      });

      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: result.error.issues[0]?.message || "Validation failed",
          fields,
        },
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
