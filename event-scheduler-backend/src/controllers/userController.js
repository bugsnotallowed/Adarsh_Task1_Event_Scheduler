const User = require("../models/User");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.json(user);
};

const updateWorkingHours = async (req, res) => {
  try {
    const { start, end } = req.body;
    if (!start || !end) return res.status(400).json({ error: "Missing start/end" });
    const user = await User.findById(req.user._id);
    user.workingHours = { start, end };
    await user.save();
    return res.json(user.workingHours);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProfile, updateWorkingHours };
