import api from "./api";

export const fetchEvents = async () => {
  const res = await api.get("/api/events");
  return res.data;
};

export const createEvent = async (payload) => {
  const res = await api.post("/api/events", payload);
  return res.data;
};

export const updateEvent = async (id, payload) => {
  const res = await api.put(`/api/events/${id}`, payload);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/api/events/${id}`);
  return res.data;
};

export const getConflicts = async () => {
  const res = await api.get("/api/events/conflicts");
  return res.data;
};

export const suggestSlot = async (payload) => {
  const res = await api.post("/api/events/suggest", payload);
  return res.data;
};
