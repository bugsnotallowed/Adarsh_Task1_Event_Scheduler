const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateWorkingHours } = require("../controllers/userController");

router.use(auth);

router.get("/me", getProfile);
router.put("/working-hours", updateWorkingHours);

module.exports = router;
