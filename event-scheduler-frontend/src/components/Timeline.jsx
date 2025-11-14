import React from "react";

export default function Timeline({ dayStart, dayEnd, pixelsPerMinute }) {
  const hours = [];
  for (let m = dayStart; m <= dayEnd; m += 60) {
    const h = Math.floor(m / 60);
    const hh = String(h).padStart(2, "0");
    hours.push({ label: `${hh}:00`, top: (m - dayStart) * pixelsPerMinute });
  }
  const height = (dayEnd - dayStart) * pixelsPerMinute;
  return (
    <div className="relative w-full border-l border-slate-200 bg-slate-50" style={{ height }}>
      {hours.map((hr) => (
        <div key={hr.label} style={{ top: hr.top }} className="absolute left-0 right-0 border-t border-slate-200 flex items-start">
          <div className="w-20 text-right pr-2 text-xs text-slate-500 select-none">{hr.label}</div>
          <div className="flex-1 h-0.5"></div>
        </div>
      ))}
    </div>
  );
}
