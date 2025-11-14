const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema({
  start: { type: String, default: "08:00" }, // "HH:MM"
  end: { type: String, default: "18:00" }    // "HH:MM"
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  workingHours: { type: WorkingHoursSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
