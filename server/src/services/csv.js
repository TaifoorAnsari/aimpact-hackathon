import { Parser } from "json2csv";

export function generateCsvStream(registrations) {
  const flatRows = [];

  for (const reg of registrations) {
    reg.members.forEach((m, idx) => {
      flatRows.push({
        RegId: reg.regId,
        TeamName: reg.teamName,
        Track: reg.track,
        Status: reg.status,
        Idea: reg.idea || "",
        PptUrl: reg.pptUrl || "",
        DemoVideoUrl: reg.demoVideoUrl || "",
        CheckedIn: reg.checkedIn ? "YES" : "NO",
        CheckedInAt: reg.checkedInAt ? new Date(reg.checkedInAt).toISOString() : "",
        RegistrationDate: new Date(reg.createdAt).toISOString(),
        MemberRole: m.isLeader ? "Leader" : `Member ${idx + 1}`,
        MemberName: m.name,
        MemberEmail: m.email,
        MemberPhone: m.phone,
        College: m.college,
        Department: m.department,
        Year: m.year,
        GitHub: m.github || "",
        LinkedIn: m.linkedin || "",
        Diet: m.diet || "",
        TShirt: m.tshirt || "",
      });
    });
  }

  const fields = [
    "RegId",
    "TeamName",
    "Track",
    "Status",
    "Idea",
    "PptUrl",
    "DemoVideoUrl",
    "CheckedIn",
    "CheckedInAt",
    "RegistrationDate",
    "MemberRole",
    "MemberName",
    "MemberEmail",
    "MemberPhone",
    "College",
    "Department",
    "Year",
    "GitHub",
    "LinkedIn",
    "Diet",
    "TShirt",
  ];

  const parser = new Parser({ fields });
  return parser.parse(flatRows);
}
