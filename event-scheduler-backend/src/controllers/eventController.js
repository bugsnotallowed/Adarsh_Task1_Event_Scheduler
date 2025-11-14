const Event = require("../models/Event");
const { hhmmToMinutes, minutesToHHMM } = require("../utils/time");
const User = require("../models/User");

/**
 * Helper to sort events by startTime (ascending)
 */
function sortEvents(events) {
  return events.sort((a, b) => {
    const aa = hhmmToMinutes(a.startTime);
    const bb = hhmmToMinutes(b.startTime);
    return aa - bb;
  });
}

/**
 * Conflict detection:
 * Events conflict if A.start < B.end AND B.start < A.end
 * This function receives an array of events (unsorted), sorts them, and returns an array of conflict pairs.
 */
function findConflicts(events) {
  const sorted = sortEvents(events.map(e => ({ ...e._doc ? e._doc : e })));
  const conflicts = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const Astart = hhmmToMinutes(sorted[i].startTime);
      const Aend = hhmmToMinutes(sorted[i].endTime);
      const Bstart = hhmmToMinutes(sorted[j].startTime);
      const Bend = hhmmToMinutes(sorted[j].endTime);
      if (Astart < Bend && Bstart < Aend) {
        conflicts.push({
          event1: sorted[i],
          event2: sorted[j]
        });
      }
    }
  }
  return conflicts;
}

const createEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) return res.status(400).json({ error: "Missing fields" });

    if (hhmmToMinutes(startTime) === null || hhmmToMinutes(endTime) === null) return res.status(400).json({ error: "Invalid time format" });

    if (hhmmToMinutes(startTime) >= hhmmToMinutes(endTime)) return res.status(400).json({ error: "startTime must be before endTime" });

    const evt = new Event({ user: userId, title, description, startTime, endTime });
    await evt.save();
    return res.status(201).json(evt);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const evt = await Event.findOne({ _id: id, user: userId });
    if (!evt) return res.status(404).json({ error: "Event not found" });

    if (updates.startTime && updates.endTime) {
      if (hhmmToMinutes(updates.startTime) >= hhmmToMinutes(updates.endTime)) return res.status(400).json({ error: "startTime must be before endTime" });
    }

    Object.assign(evt, updates);
    await evt.save();
    return res.json(evt);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const evt = await Event.findOneAndDelete({ _id: id, user: userId });
    if (!evt) return res.status(404).json({ error: "Event not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ user: userId }).lean();
    const sorted = sortEvents(events);
    return res.json(sorted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Return conflicts for the current user's events
 */
const getConflicts = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ user: userId });
    const conflicts = findConflicts(events);
    return res.json(conflicts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Suggest alternative time slot for a given event (eventId) OR for a given duration in body.
 * Strategy:
 *  - Get user's working hours (from user)
 *  - Get all events for the user (excluding the event being rescheduled, if provided)
 *  - Compute gaps between events (within working hours)
 *  - Find the first gap that fits the required duration
 */
const suggestSlot = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId, durationMinutes } = req.body; // durationMinutes optional (if eventId provided, it will be computed)
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const workingStart = hhmmToMinutes(user.workingHours.start || "08:00");
    const workingEnd = hhmmToMinutes(user.workingHours.end || "18:00");

    let targetDuration = durationMinutes || null;
    let events = await Event.find({ user: userId }).lean();

    // If eventId provided, remove it from the list (we are trying to reschedule it)
    if (eventId) {
      const idx = events.findIndex(e => String(e._id) === String(eventId));
      if (idx !== -1) {
        // if duration not provided, compute from stored event
        if (!targetDuration) {
          const e = events[idx];
          targetDuration = hhmmToMinutes(e.endTime) - hhmmToMinutes(e.startTime);
        }
        events.splice(idx, 1);
      }
    }
    if (!targetDuration) return res.status(400).json({ error: "No duration provided or found" });

    // normalize and sort events
    events = events
      .map(e => ({
        start: hhmmToMinutes(e.startTime),
        end: hhmmToMinutes(e.endTime)
      }))
      .filter(e => e.start !== null && e.end !== null)
      .sort((a, b) => a.start - b.start);

    // consider gap before first event
    let prevEnd = workingStart;
    for (let i = 0; i <= events.length; i++) {
      const nextStart = i < events.length ? events[i].start : workingEnd;
      const gap = nextStart - prevEnd;
      if (gap >= targetDuration) {
        // found slot
        const start = prevEnd;
        const end = prevEnd + targetDuration;
        return res.json({
          start: minutesToHHMM(start),
          end: minutesToHHMM(end)
        });
      }
      prevEnd = i < events.length ? Math.max(prevEnd, events[i].end) : prevEnd;
    }

    return res.status(404).json({ error: "No available slot in working hours" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getConflicts,
  suggestSlot
};
