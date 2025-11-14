import React, { useRef, useState } from "react";
import { minutesToHHMM } from "../utils/time";

export default function EventCard({ event, dayStart, pixelsPerMinute, onReschedule, conflicted }) {
  // event: { _id, title, startTime, endTime }
  const cardRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const startMins = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const duration = startMins(event.endTime) - startMins(event.startTime);

  const onPointerDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const origTop = (startMins(event.startTime) - dayStart) * pixelsPerMinute;
    setDragging({ startY, origTop });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (ev) => {
    if (!dragging) return;
    const delta = ev.clientY - dragging.startY;
    const newTop = Math.max(0, dragging.origTop + delta);
    if (cardRef.current) cardRef.current.style.transform = `translateY(${newTop}px)`;
  };

  const onPointerUp = (ev) => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    if (!dragging) return;
    const delta = ev.clientY - dragging.startY;
    const newTop = Math.max(0, dragging.origTop + delta);
    // compute new start minutes rounded to 15 min
    let newStartMins = Math.round((newTop / pixelsPerMinute)) + dayStart;
    // snap to 15 minutes
    newStartMins = Math.round(newStartMins / 15) * 15;
    const newEndMins = newStartMins + duration;
    // fire callback
    onReschedule(event._id, newStartMins, newEndMins);
    // reset transform
    if (cardRef.current) cardRef.current.style.transform = "";
    setDragging(false);
  };

  const top = (startMins(event.startTime) - dayStart) * pixelsPerMinute;
  const height = duration * pixelsPerMinute;

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      className={
        "absolute left-4 right-4 rounded p-2 cursor-move shadow " +
        (conflicted ? "border-2 border-red-500 bg-red-50" : "bg-white")
      }
      style={{ top, height, touchAction: "none" }}
      title={`${event.title} (${event.startTime} - ${event.endTime})`}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs text-slate-600">{event.startTime} - {event.endTime}</div>
    </div>
  );
}
