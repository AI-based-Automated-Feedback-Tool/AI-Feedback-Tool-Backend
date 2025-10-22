// routes/uploadsRoutes.js
const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const mime = require("mime-types");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = mime.extension(file.mimetype) || "bin";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB server-side cap
});

// POST /api/uploads/image?allowed=png,jpg,svg
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // validate against ?allowed list (optional)
    const allowed = (req.query.allowed || "")
      .toString()
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const ext = (mime.extension(req.file.mimetype) || "").toLowerCase();
    if (allowed.length && !allowed.includes(ext)) {
      fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ error: `Invalid file type .${ext}. Allowed: ${allowed.join(", ")}` });
    }

    const publicUrl = `/uploads/${req.file.filename}`; // served by express static
    return res.json({
      url: publicUrl,
      mime: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
