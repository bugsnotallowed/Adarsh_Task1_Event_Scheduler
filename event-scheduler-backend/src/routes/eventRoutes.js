const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getConflicts,
  suggestSlot
} = require("../controllers/eventController");

router.use(auth);

// CRUD
router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

// conflicts
router.get("/conflicts", getConflicts);

// suggest slot
router.post("/suggest", suggestSlot);

module.exports = router;
