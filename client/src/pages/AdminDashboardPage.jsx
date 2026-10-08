import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TbUsers,
  TbUserCheck,
  TbFlame,
  TbSearch,
  TbDownload,
  TbLogout,
  TbX,
  TbCheck,
  TbAlertCircle,
  TbClock,
  TbEdit,
  TbSparkles,
} from "react-icons/tb";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Summary & Stats
  const [summary, setSummary] = useState(null);

  // Registrations table state
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected registration for drawer
  const [selectedReg, setSelectedReg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [drawerNotes, setDrawerNotes] = useState("");

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("aimpact_admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch summary stats
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/summary`, {
        headers: { ...getAuthHeader() },
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch {
      // ignore
    }
  }, [getAuthHeader, navigate]);

  // Fetch registrations table
  const fetchRegistrations = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        track: trackFilter,
        status: statusFilter,
        search,
      });

      const res = await fetch(`${API_BASE}/api/admin/registrations?${params.toString()}`, {
        headers: { ...getAuthHeader() },
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, trackFilter, statusFilter, search, getAuthHeader, navigate]);

  // Verify auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/me`, {
          headers: { ...getAuthHeader() },
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/admin/login");
          return;
        }
        const data = await res.json();
        setAdminUser(data.admin);
        fetchSummary();
        fetchRegistrations();
      } catch {
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [fetchRegistrations, fetchSummary, getAuthHeader, navigate]);

  // Refetch when filters change
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("aimpact_admin_token");
    localStorage.removeItem("aimpact_admin_user");
    navigate("/admin/login");
  };

  const openDrawer = (reg) => {
    setSelectedReg(reg);
    setDrawerNotes(reg.notes || "");
  };

  const closeDrawer = () => {
    setSelectedReg(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${selectedReg._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedReg(data.registration);
        fetchRegistrations();
        fetchSummary();
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckInToggle = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${selectedReg._id}/check-in`, {
        method: "POST",
        headers: { ...getAuthHeader() },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedReg(data.registration);
        fetchRegistrations();
        fetchSummary();
      }
    } catch (err) {
      alert("Failed to check-in: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${selectedReg._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
        body: JSON.stringify({ notes: drawerNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedReg(data.registration);
        fetchRegistrations();
      }
    } catch (err) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem("aimpact_admin_token");
    const exportUrl = `${API_BASE}/api/admin/export.csv${token ? `?token=${token}` : ""}`;
    window.open(exportUrl, "_blank");
  };

  const overview = summary?.overview || {
    totalTeams: totalCount,
    confirmedTeams: registrations.filter((r) => r.status === "confirmed").length,
    checkedInTeams: registrations.filter((r) => r.checkedIn).length,
    spotsLeft: 150,
    totalParticipants: totalCount * 3,
  };

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="logo" style={{ width: "24px", height: "24px" }} />
            <strong style={{ fontFamily: "var(--font-display)", letterSpacing: "1px", color: "var(--teal-soft)" }}>
              AIMPACT
            </strong>
          </Link>
          <span className="admin-badge">ORGANIZER OPS</span>
        </div>

        <nav className="admin-header__nav">
          <Link to="/admin/checkin" className="admin-nav-link">
            <TbUserCheck style={{ fontSize: "16px" }} /> Desk Check-in
          </Link>

          <button type="button" onClick={handleExportCsv} className="admin-nav-link">
            <TbDownload style={{ fontSize: "16px" }} /> Export CSV
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-nav-link"
            style={{ color: "#ff8787", borderColor: "rgba(255, 107, 107, 0.3)" }}
          >
            <TbLogout style={{ fontSize: "16px" }} /> Sign Out
          </button>
        </nav>
      </header>

      <main className="admin-main">
        {/* Stat Tiles */}
        <section className="admin-stats-grid" aria-label="Key Registration Metrics">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <TbUsers />
            </div>
            <div>
              <div className="admin-stat-num">{overview.totalTeams}</div>
              <div className="admin-stat-label">Total Teams</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <TbSparkles />
            </div>
            <div>
              <div className="admin-stat-num">{overview.totalParticipants}</div>
              <div className="admin-stat-label">Total Participants</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <TbFlame />
            </div>
            <div>
              <div className="admin-stat-num">{overview.spotsLeft}</div>
              <div className="admin-stat-label">Spots Left (of 150)</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ color: "#4cd964", borderColor: "#4cd964" }}>
              <TbUserCheck />
            </div>
            <div>
              <div className="admin-stat-num">{overview.checkedInTeams}</div>
              <div className="admin-stat-label">Checked-In Teams</div>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <section className="admin-charts-grid" aria-label="Analytics Visualizations">
          {/* Registrations over time */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">Registrations Activity</h3>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={
                    summary?.byDay && summary.byDay.length > 0
                      ? summary.byDay
                      : [
                          { date: "Day 1", count: 4 },
                          { date: "Day 2", count: 8 },
                          { date: "Day 3", count: 18 },
                          { date: "Day 4", count: 26 },
                          { date: "Today", count: overview.totalTeams },
                        ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6fc7d1" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#6fc7d1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" stroke="#e6c3ca" fontSize={11} />
                  <YAxis stroke="#e6c3ca" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c0712",
                      borderColor: "#6fc7d1",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#6fc7d1" strokeWidth={2} fill="url(#tealGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registrations by Track */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">By Hackathon Track</h3>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart
                  data={
                    summary?.byTrack && summary.byTrack.length > 0
                      ? summary.byTrack
                      : [
                          { name: "ai-education", count: 12 },
                          { name: "ai-healthcare", count: 8 },
                        ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="#e6c3ca" fontSize={11} />
                  <YAxis stroke="#e6c3ca" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c0712",
                      borderColor: "#6fc7d1",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" fill="#6fc7d1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Table Filter & Search Controls */}
        <div className="table-controls">
          <div className="search-box">
            <TbSearch className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="search-input"
              placeholder="Search team, reg ID, member, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="filter-chips">
            <span style={{ fontSize: "11px", color: "var(--teal-soft)", textTransform: "uppercase" }}>
              Track:
            </span>
            {["all", "ai-education", "ai-healthcare"].map((tr) => (
              <button
                key={tr}
                type="button"
                className={`filter-chip ${trackFilter === tr ? "filter-chip--active" : ""}`}
                onClick={() => {
                  setTrackFilter(tr);
                  setPage(1);
                }}
              >
                {tr === "all" ? "All Tracks" : tr === "ai-education" ? "AI for Education" : "AI for Healthcare"}
              </button>
            ))}
          </div>

          <div className="filter-chips">
            <span style={{ fontSize: "11px", color: "var(--teal-soft)", textTransform: "uppercase" }}>
              Status:
            </span>
            {["all", "confirmed", "waitlisted", "cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-chip ${statusFilter === st ? "filter-chip--active" : ""}`}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
              >
                {st === "all" ? "All Status" : st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Team</th>
                <th>Track</th>
                <th>Leader</th>
                <th>College</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No registrations found matching the current search & filters.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const leader = reg.members.find((m) => m.isLeader) || reg.members[0];
                  return (
                    <tr key={reg._id} onClick={() => openDrawer(reg)}>
                      <td>
                        <strong style={{ color: "var(--ice)", letterSpacing: "1px" }}>{reg.regId}</strong>
                      </td>
                      <td style={{ color: "#fff", fontWeight: "600" }}>{reg.teamName}</td>
                      <td>
                        <span style={{ color: "var(--teal-soft)", textTransform: "uppercase", fontSize: "11px" }}>
                          {reg.track}
                        </span>
                      </td>
                      <td>{leader?.name || "N/A"}</td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {leader?.college || "N/A"}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${reg.status}`}>{reg.status}</span>
                      </td>
                      <td>
                        {reg.checkedIn ? (
                          <span className="checkin-badge">
                            <TbCheck /> YES
                          </span>
                        ) : (
                          <span style={{ color: "#888", fontSize: "11px" }}>NO</span>
                        )}
                      </td>
                      <td style={{ fontSize: "11px" }}>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="pagination">
          <span>
            Showing <strong>{registrations.length}</strong> of <strong>{totalCount}</strong> teams
          </span>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              className="pagination-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              &larr; Prev
            </button>
            <span style={{ fontSize: "12px", color: "var(--ice)" }}>
              Page {page} of {totalPages || 1}
            </span>
            <button
              type="button"
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </main>

      {/* Side Drawer for Details & Actions */}
      {selectedReg && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Team Details Drawer">
            <div className="drawer-header">
              <div>
                <span className="reg-id-label">{selectedReg.regId}</span>
                <h2 className="drawer-title">{selectedReg.teamName}</h2>
              </div>
              <button type="button" className="drawer-close" onClick={closeDrawer} aria-label="Close drawer">
                <TbX />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="drawer-actions">
              <button
                type="button"
                className="btn btn--solid"
                style={{ fontSize: "12px", padding: "8px 14px" }}
                onClick={handleCheckInToggle}
                disabled={actionLoading}
              >
                {selectedReg.checkedIn ? "Undo Check-In" : "Check In Team"}
              </button>

              <button
                type="button"
                className="btn btn--ghost"
                style={{ fontSize: "12px", padding: "8px 14px" }}
                onClick={() => handleStatusChange("confirmed")}
                disabled={actionLoading || selectedReg.status === "confirmed"}
              >
                Mark Confirmed
              </button>

              <button
                type="button"
                className="btn btn--ghost"
                style={{ fontSize: "12px", padding: "8px 14px" }}
                onClick={() => handleStatusChange("waitlisted")}
                disabled={actionLoading || selectedReg.status === "waitlisted"}
              >
                Waitlist
              </button>

              <button
                type="button"
                className="btn btn--ghost"
                style={{ fontSize: "12px", padding: "8px 14px", color: "#ff8787", borderColor: "#ff8787" }}
                onClick={() => handleStatusChange("cancelled")}
                disabled={actionLoading || selectedReg.status === "cancelled"}
              >
                Cancel Team
              </button>
            </div>

            {/* Team details overview */}
            <div style={{ marginBottom: "20px" }}>
              <div className="summary-row">
                <span>Track:</span>
                <span style={{ textTransform: "uppercase" }}>{selectedReg.track}</span>
              </div>
              <div className="summary-row">
                <span>Status:</span>
                <span className={`status-badge status-badge--${selectedReg.status}`}>{selectedReg.status}</span>
              </div>
              <div className="summary-row">
                <span>Checked In:</span>
                <span>{selectedReg.checkedIn ? `Yes (${new Date(selectedReg.checkedInAt).toLocaleTimeString()})` : "No"}</span>
              </div>
              {selectedReg.pptUrl && (
                <div className="summary-row">
                  <span>Pitch Deck (PPT):</span>
                  <span>
                    <a
                      href={selectedReg.pptUrl.startsWith("http") ? selectedReg.pptUrl : `https://${selectedReg.pptUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--teal-soft)", textDecoration: "underline", wordBreak: "break-all" }}
                    >
                      Open Google Drive Deck &rarr;
                    </a>
                  </span>
                </div>
              )}
              {selectedReg.demoVideoUrl && (
                <div className="summary-row">
                  <span>Demo Video:</span>
                  <span>
                    <a
                      href={selectedReg.demoVideoUrl.startsWith("http") ? selectedReg.demoVideoUrl : `https://${selectedReg.demoVideoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--teal-soft)", textDecoration: "underline", wordBreak: "break-all" }}
                    >
                      Watch Demo Video &rarr;
                    </a>
                  </span>
                </div>
              )}
              {selectedReg.idea && (
                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", color: "var(--teal-soft)", textTransform: "uppercase" }}>
                    Project Idea:
                  </span>
                  <p style={{ margin: "4px 0 0", color: "#fff", fontSize: "13px", lineHeight: "1.5" }}>
                    {selectedReg.idea}
                  </p>
                </div>
              )}
            </div>

            {/* Member Roster */}
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--teal-soft)", margin: "0 0 12px" }}>
              Roster ({selectedReg.members?.length} Members)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {selectedReg.members?.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "#fff", fontSize: "13px" }}>{m.name}</strong>
                    {m.isLeader && <span className="leader-badge">LEADER</span>}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--ice)", marginBottom: "2px" }}>
                    {m.email} • {m.phone}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--rose)" }}>
                    {m.college} • {m.department} ({m.year})
                  </div>
                  {(m.diet || m.tshirt) && (
                    <div style={{ fontSize: "11px", color: "var(--teal-soft)", marginTop: "4px" }}>
                      Diet: {m.diet} | T-Shirt: {m.tshirt}
                    </div>
                  )}
                  {(m.github || m.linkedin) && (
                    <div style={{ fontSize: "11px", marginTop: "4px", display: "flex", gap: "10px" }}>
                      {m.github && (
                        <a href={m.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)", textDecoration: "underline" }}>
                          GitHub
                        </a>
                      )}
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)", textDecoration: "underline" }}>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Organizer Notes */}
            <div style={{ marginTop: "auto" }}>
              <label className="form-label" htmlFor="drawer-notes">
                Organizer Internal Notes
              </label>
              <textarea
                id="drawer-notes"
                className="form-textarea"
                rows={3}
                placeholder="Add jury notes, verification status, table number assignment..."
                value={drawerNotes}
                onChange={(e) => setDrawerNotes(e.target.value)}
              />
              <button
                type="button"
                className="btn btn--ghost"
                style={{ marginTop: "8px", fontSize: "12px", padding: "6px 12px" }}
                onClick={handleSaveNotes}
                disabled={actionLoading}
              >
                Save Notes
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
