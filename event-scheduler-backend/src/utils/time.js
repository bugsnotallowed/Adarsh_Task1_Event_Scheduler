/**
 * Time helpers
 * - parse "HH:MM" to minutes
 * - format minutes to "HH:MM"
 */

function hhmmToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return null;
  const parts = hhmm.split(":");
  if (parts.length !== 2) return null;
  const hh = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function minutesToHHMM(mins) {
  if (typeof mins !== "number" || !Number.isFinite(mins)) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

module.exports = {
  hhmmToMinutes,
  minutesToHHMM
};
