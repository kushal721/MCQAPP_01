const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const { signToken } = require("../middleware/auth");

// Compared against when the email is unknown, so response time doesn't
// reveal which emails have accounts.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

// Simple in-memory limiter: max failed logins per IP per window.
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

const isLimited = (ip) => {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
};

const recordFailure = (ip) => {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failures.set(ip, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
};

exports.login = async (req, res) => {
  const ip = req.ip;
  if (isLimited(ip)) {
    return res.status(429).json({
      message: "Too many failed attempts. Please wait 15 minutes and try again.",
    });
  }

  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    const valid = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);

    if (!admin || !valid) {
      recordFailure(ip);
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    failures.delete(ip);
    admin.lastLoginAt = new Date();
    await admin.save();

    res.status(200).json({ token: signToken(admin), admin: admin.toPublic() });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error. Could not sign in." });
  }
};

// Returns the signed-in admin; used by the frontend to validate a stored token.
exports.me = (req, res) => {
  res.status(200).json({ admin: req.admin.toPublic() });
};
