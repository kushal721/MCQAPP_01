const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "12h";

exports.signToken = (admin) =>
  jwt.sign({ sub: String(admin._id) }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

// Rejects the request unless it carries a valid admin token
// ("Authorization: Bearer <token>"). Sets req.admin on success.
exports.requireAdmin = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please sign in again."
        : "Invalid session. Please sign in again.";
    return res.status(401).json({ message });
  }

  try {
    // Looked up on every request so a deleted admin loses access immediately.
    const admin = await Admin.findById(payload.sub);
    if (!admin) {
      return res.status(401).json({ message: "Account no longer exists." });
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
