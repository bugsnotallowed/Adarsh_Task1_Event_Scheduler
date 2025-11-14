import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Timeline from "../components/Timeline";
import EventCard from "../components/EventCard";
import { fetchEvents, getConflicts, createEvent, updateEvent, suggestSlot } from "../services/events";
import { hhmmToMinutes, minutesToHHMM } from "../utils/time";
import api from "../services/api";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [workingHours, setWorkingHours] = useState({ start: "08:00", end: "18:00" });
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:00");
  const pixelsPerMinute = 1.0; // 1px per minute (600 minutes -> 600px for 10 hours)
  const dayStart = hhmmToMinutes(workingHours.start);
  const dayEnd = hhmmToMinutes(workingHours.end);

  const loadEvents = useCallback(async () => {
    try {
      const ev = await fetchEvents();
      setEvents(ev);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadConflicts = useCallback(async () => {
    try {
      const c = await getConflicts();
      // build set of conflicted event ids
      const setIds = new Set();
      c.forEach(pair => {
        if (pair.event1?._id) setIds.add(pair.event1._id);
        if (pair.event2?._id) setIds.add(pair.event2._id);
      });
      setConflicts(Array.from(setIds));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadWorkingHours = useCallback(async () => {
    try {
      const res = await api.get("/api/users/me");
      setWorkingHours(res.data.workingHours || { start: "08:00", end: "18:00" });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadWorkingHours();
    loadEvents();
    loadConflicts();
    // poll conflicts a bit to show updates
    const id = setInterval(loadConflicts, 3000);
    return () => clearInterval(id);
  }, [loadEvents, loadConflicts, loadWorkingHours]);

  const onReschedule = async (id, newStartMins, newEndMins) => {
    // clamp to working hours
    if (newStartMins < dayStart) {
      newStartMins = dayStart;
      newEndMins = newStartMins + (hhmmToMinutes(events.find(e => e._id === id).endTime) - hhmmToMinutes(events.find(e => e._id === id).startTime));
    }
    if (newEndMins > dayEnd) {
      newEndMins = dayEnd;
      newStartMins = newEndMins - (hhmmToMinutes(events.find(e => e._id === id).endTime) - hhmmToMinutes(events.find(e => e._id === id).startTime));
    }
    try {
      const res = await updateEvent(id, { startTime: minutesToHHMM(newStartMins), endTime: minutesToHHMM(newEndMins) });
      // refresh events and conflicts
      await loadEvents();
      await loadConflicts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to reschedule");
    }
  };

  const onCreate = async () => {
    try {
      await createEvent({ title: newTitle, startTime: newStart, endTime: newEnd });
      setShowNewModal(false);
      setNewTitle("");
      await loadEvents();
      await loadConflicts();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create");
    }
  };

  const openSettings = () => {
    const s = prompt("Set working hours start (HH:MM)", workingHours.start);
    const e = prompt("Set working hours end (HH:MM)", workingHours.end);
    if (!s || !e) return;
    api.put("/api/users/working-hours", { start: s, end: e }).then(() => {
      setWorkingHours({ start: s, end: e });
      loadEvents();
      loadConflicts();
    }).catch(err => alert(err.response?.data?.error || "Failed to set working hours"));
  };

  const onSuggestForEvent = async (id) => {
    try {
      const res = await suggestSlot({ eventId: id });
      if (res.start) {
        if (confirm(`Suggested slot: ${res.start} - ${res.end}. Apply?`)) {
          await updateEvent(id, { startTime: res.start, endTime: res.end });
          await loadEvents();
          await loadConflicts();
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || "No suggestions");
    }
  };

  // height of timeline container
  const containerHeight = (dayEnd - dayStart) * pixelsPerMinute;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenSettings={openSettings} />
      <div className="p-4 flex gap-4">
        <div className="w-3/4 bg-white rounded shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Schedule ({workingHours.start} - {workingHours.end})</h2>
            <div>
              <button onClick={() => setShowNewModal(true)} className="px-3 py-1 bg-blue-600 text-white rounded">New Event</button>
            </div>
          </div>

          <div className="relative border rounded overflow-auto" style={{ height: containerHeight }}>
            <Timeline dayStart={dayStart} dayEnd={dayEnd} pixelsPerMinute={pixelsPerMinute} />
            {events.map((ev) => (
              <EventCard
                key={ev._id}
                event={ev}
                dayStart={dayStart}
                pixelsPerMinute={pixelsPerMinute}
                onReschedule={onReschedule}
                conflicted={conflicts.includes(ev._id)}
              />
            ))}
          </div>
        </div>

        <div className="w-1/4">
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Conflicts</h3>
            {conflicts.length === 0 ? <div className="text-slate-500">No conflicts</div> :
              events.filter(e => conflicts.includes(e._id)).map(e => (
                <div key={e._id} className="flex items-center justify-between p-2 border rounded mb-2">
                  <div>
                    <div className="text-sm font-medium">{e.title}</div>
                    <div className="text-xs text-slate-600">{e.startTime} - {e.endTime}</div>
                  </div>
                  <div>
                    <button onClick={() => onSuggestForEvent(e._id)} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Suggest</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {showNewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="font-semibold mb-3">Create Event</h3>
            <div className="space-y-2">
              <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded"/>
              <div className="flex gap-2">
                <input value={newStart} onChange={e=>setNewStart(e.target.value)} placeholder="Start (HH:MM)" className="flex-1 p-2 border rounded"/>
                <input value={newEnd} onChange={e=>setNewEnd(e.target.value)} placeholder="End (HH:MM)" className="flex-1 p-2 border rounded"/>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1 bg-slate-200 rounded" onClick={()=>setShowNewModal(false)}>Cancel</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={onCreate}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
