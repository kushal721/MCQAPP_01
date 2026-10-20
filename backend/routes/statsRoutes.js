const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const { requireAdmin } = require("../middleware/auth");

router.get("/", requireAdmin, getStats);

module.exports = router;
