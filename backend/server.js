require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());

/* ===================== DATABASE ===================== */
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/portfolio")
  .then(() => console.log("🍃 MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

/* ===================== SCHEMAS & MODELS ===================== */
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  tech: [String],
  link: String,
  language: String,
  image: String
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { timestamps: true });

const statsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 }
});

const aboutSchema = new mongoose.Schema({
  description: String,
  resumeLink: String, // Fallback Google Drive Link
  resumeFile: String, // URL to PDF on this server
});

const Admin = mongoose.model("Admin", adminSchema);
const Project = mongoose.model("Project", projectSchema);
const Message = mongoose.model("Message", messageSchema);
const Stats = mongoose.model("Stats", statsSchema);
const About = mongoose.model('About', aboutSchema);

/* ===================== DEFAULT ADMIN SETUP ===================== */
const createDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        name: "Admin User",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });
      console.log("✅ Default Admin Created");
    }
  } catch (err) { console.log("Admin check skipped:", err.message); }
};
createDefaultAdmin();

/* ===================== AUTH MIDDLEWARE ===================== */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) return res.status(401).json({ message: "Admin not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== FILE UPLOAD CONFIG ===================== */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/* ===================== ADMIN ROUTES ===================== */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch { res.status(500).json({ message: "Server error" }); }
});

app.get("/api/admin/overview", protect, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  const projects = await Project.find().sort({ createdAt: -1 });
  const stats = await Stats.findOne() || { views: 0 };
  const about = await About.findOne();

  res.json({ messages, projects, views: stats.views, about });
});

/* ===================== ABOUT & RESUME ROUTES ===================== */

// Get About (Public)
app.get('/api/about', async (req, res) => {
  try {
    const about = await About.findOne() || { description: "Add bio in Admin", resumeLink: "", resumeFile: "" };
    res.json(about);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Update Bio Description (Protected)
app.post('/api/about', protect, async (req, res) => {
  try {
    const updatedAbout = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(updatedAbout);
  } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

// PDF Resume Upload (Protected)
app.post("/api/about/upload-resume", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updated = await About.findOneAndUpdate(
      {}, 
      { resumeFile: filePath }, 
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) { res.status(500).json({ message: "Upload failed" }); }
});

/* ===================== PROJECT ROUTES ===================== */
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

app.post("/api/projects", protect, upload.single("image"), async (req, res) => {
  const { title, desc, link, language, tech } = req.body;
  const project = await Project.create({
    title, desc, link, language,
    tech: tech ? tech.split(",").map(t => t.trim()) : [],
    image: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null
  });
  res.status(201).json(project);
});

app.put("/api/projects/:id", protect, upload.single("image"), async (req, res) => {
  const { title, desc, link, language, tech } = req.body;
  const updateData = { title, desc, link, language };
  if (tech) updateData.tech = tech.split(",").map(t => t.trim());
  if (req.file) updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

app.delete("/api/projects/:id", protect, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

/* ===================== MESSAGES & STATS ===================== */
app.post("/api/messages", async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json(message);
});

app.post("/api/stats/visit", async (req, res) => {
  await Stats.findOneAndUpdate({}, { $inc: { views: 1 } }, { upsert: true });
  res.send("Tracked");
});

/* ===================== START SERVER ===================== */
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));