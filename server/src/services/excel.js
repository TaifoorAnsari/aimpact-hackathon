import * as XLSX from "xlsx";

function formatTrack(track) {
  if (!track) return "";
  if (track === "ai-education") return "AI for Education";
  if (track === "ai-business" || track === "ai-commerce" || track === "ai-healthcare") return "AI for Business & Commerce";
  if (track === "ai-ml") return "AI / ML";
  if (track === "healthtech") return "HealthTech";
  if (track === "web-iot") return "Web and IoT";
  return track.toUpperCase();
}

function formatDate(date) {
  if (!date) return "";
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  } catch {
    return "";
  }
}

function computeColWidths(data) {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    for (const row of data) {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const len = String(val).length;
        if (len > maxLen) maxLen = len;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
  });
}

export function generateExcelWorkbook(registrations) {
  const wb = XLSX.utils.book_new();

  // ----------------------------------------------------
  // Sheet 1: Teams Overview (1 row per team)
  // ----------------------------------------------------
  const teamsData = registrations.map((reg, idx) => {
    const leader = reg.members?.find((m) => m.isLeader) || reg.members?.[0] || {};
    const otherMembers = reg.members?.filter((m) => m !== leader) || [];
    const m2 = otherMembers[0] || {};
    const m3 = otherMembers[1] || {};
    const m4 = otherMembers[2] || {};

    return {
      "S.No": idx + 1,
      "Registration ID": reg.regId,
      "Team Name": reg.teamName,
      "Track": formatTrack(reg.track),
      "Status": (reg.status || "confirmed").toUpperCase(),
      "Checked In": reg.checkedIn ? "YES" : "NO",
      "Team Size": reg.members?.length || 0,
      "Pitch Deck (PPT Link)": reg.pptUrl || "",
      "Demo Video Link": reg.demoVideoUrl || "",
      "Problem Concept / Idea": reg.idea || "",
      // Leader details
      "Leader Name": leader.name || "",
      "Leader Phone": leader.phone || "",
      "Leader Email": leader.email || "",
      "Leader College": leader.college || "",
      "Leader Department": leader.department || "",
      "Leader Academic Year": leader.year || "",
      // Member 2
      "Member 2 Name": m2.name || "",
      "Member 2 Phone": m2.phone || "",
      "Member 2 Email": m2.email || "",
      "Member 2 College": m2.college || "",
      "Member 2 Department": m2.department || "",
      "Member 2 Year": m2.year || "",
      // Member 3
      "Member 3 Name": m3.name || "",
      "Member 3 Phone": m3.phone || "",
      "Member 3 Email": m3.email || "",
      "Member 3 College": m3.college || "",
      "Member 3 Department": m3.department || "",
      "Member 3 Year": m3.year || "",
      // Member 4
      "Member 4 Name": m4.name || "",
      "Member 4 Phone": m4.phone || "",
      "Member 4 Email": m4.email || "",
      "Member 4 College": m4.college || "",
      "Member 4 Department": m4.department || "",
      "Member 4 Year": m4.year || "",
      // Timestamps
      "Checked In Time": formatDate(reg.checkedInAt),
      "Registered Date": formatDate(reg.createdAt),
    };
  });

  const wsTeams = XLSX.utils.json_to_sheet(teamsData);
  wsTeams["!cols"] = computeColWidths(teamsData);
  XLSX.utils.book_append_sheet(wb, wsTeams, "Teams Overview");

  // ----------------------------------------------------
  // Sheet 2: All Participants (1 row per participant)
  // ----------------------------------------------------
  const participantsData = [];
  let pIdx = 1;

  for (const reg of registrations) {
    reg.members?.forEach((m, mIdx) => {
      participantsData.push({
        "S.No": pIdx++,
        "Registration ID": reg.regId,
        "Team Name": reg.teamName,
        "Track": formatTrack(reg.track),
        "Role": m.isLeader ? "Team Leader" : `Member ${mIdx + 1}`,
        "Participant Name": m.name,
        "Email": m.email,
        "Phone": m.phone,
        "College": m.college,
        "Department": m.department,
        "Academic Year": m.year,
        "Pitch Deck (PPT)": reg.pptUrl || "",
        "Demo Video": reg.demoVideoUrl || "",
        "Team Status": (reg.status || "confirmed").toUpperCase(),
        "Checked In": reg.checkedIn ? "YES" : "NO",
        "Registered Date": formatDate(reg.createdAt),
      });
    });
  }

  const wsParticipants = XLSX.utils.json_to_sheet(participantsData);
  wsParticipants["!cols"] = computeColWidths(participantsData);
  XLSX.utils.book_append_sheet(wb, wsParticipants, "All Participants");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}
