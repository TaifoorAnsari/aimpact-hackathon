import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Setup transporter based on env
let transporter = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
}

function generateEmailHtml(reg) {
  const leader = reg.members.find((m) => m.isLeader) || reg.members[0];
  const memberListHtml = reg.members
    .map(
      (m) =>
        `<li style="margin-bottom: 6px; color: #e6c3ca;">
          <strong style="color: #bff4ff;">${escapeHtml(m.name)}</strong> 
          ${m.isLeader ? '<span style="color:#6fc7d1;font-size:12px;">(Team Leader)</span>' : ""} 
          - ${escapeHtml(m.college)} (${escapeHtml(m.department)}, ${m.year})
        </li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AIMPACT Hackathon Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0409; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; background: #14050d; border: 1px solid rgba(111,199,209,0.3); border-radius: 8px; overflow: hidden; margin-top: 30px; margin-bottom: 30px;">
    
    <!-- Header -->
    <div style="background: radial-gradient(circle at 50% 0%, #750e26, #14050d); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(111,199,209,0.25);">
      <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; color: #6fc7d1; text-transform: uppercase;">AIMPACT 2026</h1>
      <p style="margin: 6px 0 0; color: #e6c3ca; font-size: 14px;">8 Hours. One Idea. Your Impact.</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <h2 style="margin: 0 0 16px; color: #ffffff; font-size: 20px;">You are officially registered!</h2>
      <p style="color: #e6c3ca; line-height: 1.6; margin: 0 0 20px;">
        Greetings <strong>${escapeHtml(leader.name)}</strong> and team <strong>${escapeHtml(reg.teamName)}</strong>,<br>
        Your registration for AIMPACT 2026 at A.P. Shah Institute of Technology has been successfully received and confirmed.
      </p>

      <!-- Reg ID Card -->
      <div style="background: rgba(90,10,28,0.4); border: 1px solid #6fc7d1; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="display: block; font-size: 12px; color: #7fd3dc; text-transform: uppercase; letter-spacing: 1px;">Official Registration ID</span>
        <span style="display: block; font-size: 28px; font-weight: bold; color: #bff4ff; letter-spacing: 2px; margin: 6px 0;">${reg.regId}</span>
        <span style="display: block; font-size: 12px; color: #e6c3ca;">Show this ID at check-in desk on event morning.</span>
      </div>

      <!-- Details -->
      <div style="background: #1b0712; border-radius: 6px; padding: 18px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #7fd3dc; width: 140px;"><strong>Track:</strong></td>
            <td style="padding: 6px 0; color: #ffffff;">${escapeHtml(reg.track.toUpperCase())}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7fd3dc;"><strong>Event Date:</strong></td>
            <td style="padding: 6px 0; color: #ffffff;">Oct 17, 2026, 08:30 AM – 08:30 PM IST</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7fd3dc;"><strong>Venue:</strong></td>
            <td style="padding: 6px 0; color: #ffffff;">A.P. Shah Institute of Technology, Thane (W)</td>
          </tr>
          ${
            reg.pptUrl
              ? `<tr>
            <td style="padding: 6px 0; color: #7fd3dc;"><strong>Pitch Deck (PPT):</strong></td>
            <td style="padding: 6px 0;"><a href="${escapeHtml(reg.pptUrl)}" target="_blank" rel="noopener noreferrer" style="color: #6fc7d1; text-decoration: underline;">View Pitch Deck</a></td>
          </tr>`
              : ""
          }
          ${
            reg.demoVideoUrl
              ? `<tr>
            <td style="padding: 6px 0; color: #7fd3dc;"><strong>Demo Video:</strong></td>
            <td style="padding: 6px 0;"><a href="${escapeHtml(reg.demoVideoUrl)}" target="_blank" rel="noopener noreferrer" style="color: #6fc7d1; text-decoration: underline;">Watch Prototype Video</a></td>
          </tr>`
              : ""
          }
        </table>
      </div>

      <!-- Team Members -->
      <h3 style="color: #6fc7d1; font-size: 16px; margin: 0 0 12px;">Team Roster (${reg.members.length} Members):</h3>
      <ul style="padding-left: 20px; margin: 0 0 28px;">
        ${memberListHtml}
      </ul>

      <!-- CTA WhatsApp -->
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${ENV.WHATSAPP_GROUP_URL}" style="display: inline-block; background-color: #6fc7d1; color: #0d0409; font-weight: bold; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">
          JOIN PARTICIPANTS WHATSAPP GROUP &rarr;
        </a>
      </div>

      <p style="color: #a0808a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
        Please make sure every team member carries their college ID card and laptop on event day.<br>
        Questions? Contact us at <a href="mailto:${ENV.ADMIN_EMAIL}" style="color: #6fc7d1;">${ENV.ADMIN_EMAIL}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #0d0409; padding: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #88626c;">
      AIMPACT Hackathon • A.P. Shah Institute of Technology, Thane
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailText(reg) {
  const leader = reg.members.find((m) => m.isLeader) || reg.members[0];
  const membersText = reg.members.map((m) => `- ${m.name} (${m.college})`).join("\n");

  return `
AIMPACT 2026 - Registration Confirmed!

Hello ${leader.name},

Your team "${reg.teamName}" has been successfully registered for AIMPACT 2026!

Registration ID: ${reg.regId}
Track: ${reg.track.toUpperCase()}
Date: Oct 17, 2026 (08:30 AM – 08:30 PM IST)
Venue: A.P. Shah Institute of Technology, Thane (W)
Pitch Deck (PPT): ${reg.pptUrl || "N/A"}
${reg.demoVideoUrl ? `Demo Video: ${reg.demoVideoUrl}\n` : ""}
Team Members:
${membersText}

Join the official WhatsApp group for real-time announcements:
${ENV.WHATSAPP_GROUP_URL}

We look forward to seeing your team build great things!

Organizing Team, AIMPACT 2026
APSIT, Thane
  `.trim();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In-process retry queue (up to 3 attempts, does NOT block the HTTP response)
export function queueConfirmationEmail(reg, attempt = 1) {
  setImmediate(async () => {
    try {
      const leader = reg.members.find((m) => m.isLeader) || reg.members[0];
      const toAddresses = reg.members.map((m) => m.email).join(", ");

      if (!transporter && !ENV.RESEND_API_KEY) {
        logger.info(`[MAIL SIMULATOR] Registration confirmed for ${reg.regId} (${reg.teamName}) to: ${toAddresses}`);
        return;
      }

      if (ENV.RESEND_API_KEY) {
        // Send via Resend REST API
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: ENV.MAIL_FROM,
            to: reg.members.map((m) => m.email),
            subject: `[AIMPACT 2026] Registration Confirmed - ${reg.teamName} (${reg.regId})`,
            html: generateEmailHtml(reg),
            text: generateEmailText(reg),
          }),
        });

        if (!response.ok) {
          throw new Error(`Resend API returned status ${response.status}`);
        }
        logger.info(`Confirmation email sent via Resend for ${reg.regId}`);
      } else if (transporter) {
        // Send via SMTP Nodemailer
        await transporter.sendMail({
          from: ENV.MAIL_FROM,
          to: toAddresses,
          subject: `[AIMPACT 2026] Registration Confirmed - ${reg.teamName} (${reg.regId})`,
          html: generateEmailHtml(reg),
          text: generateEmailText(reg),
        });
        logger.info(`Confirmation email sent via SMTP for ${reg.regId}`);
      }
    } catch (err) {
      logger.error(`Failed to send confirmation email for ${reg.regId} (Attempt ${attempt}/3):`, err.message);
      if (attempt < 3) {
        setTimeout(() => queueConfirmationEmail(reg, attempt + 1), attempt * 5000);
      }
    }
  });
}
