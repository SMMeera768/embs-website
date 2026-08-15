require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const connectDB     = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes         = require('./routes/authRoutes');
const eventRoutes        = require('./routes/eventRoutes');
const podcastRoutes      = require('./routes/podcastRoutes');
const blogRoutes         = require('./routes/blogRoutes');
const memberRoutes       = require('./routes/memberRoutes');
const achievementRoutes  = require('./routes/achievementRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const galleryRoutes      = require('./routes/galleryRoutes');
const projectRoutes      = require('./routes/projectRoutes');
const newsletterRoutes   = require('./routes/newsletterRoutes');
const contactRoutes      = require('./routes/contactRoutes');

const app = express();

/* ── CORS ────────────────────────────────────── */
// Hosts we always trust: the preview/production domains of our static hosts,
// plus anything explicitly listed in CLIENT_URL (comma-separated).
const ALLOWED_SUFFIXES = ['.vercel.app', '.netlify.app'];

const ALLOWED_ORIGINS = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const isLocalhost = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const isAllowedOrigin = (origin) => {
  // Same-origin requests, curl and server-to-server calls send no Origin header.
  if (!origin) return true;

  const clean = origin.replace(/\/$/, '');

  if (ALLOWED_ORIGINS.includes(clean)) return true;
  if (isLocalhost(clean)) return true;

  try {
    const { hostname } = new URL(clean);
    return ALLOWED_SUFFIXES.some(suffix => hostname.endsWith(suffix));
  } catch {
    return false;
  }
};

app.use(cors({
  // Returning `false` omits the CORS headers so the browser reports a normal
  // CORS failure. Passing an Error here would surface as a confusing 500.
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  credentials: true
}));

/* ── Core Middleware ─────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ── Static Uploads ──────────────────────────── */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ── Routes ──────────────────────────────────── */
app.use('/api/auth',          authRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/podcasts',      podcastRoutes);
app.use('/api/blogs',         blogRoutes);
app.use('/api/members',       memberRoutes);
app.use('/api/achievements',  achievementRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery',       galleryRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/newsletter',    newsletterRoutes);
app.use('/api/contact',       contactRoutes);

/* ── Health Check ────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

/* ── 404 Handler ─────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

/* ── Global Error Handler ────────────────────── */
app.use(errorMiddleware);

/* ── Start Server ────────────────────────────── */
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

start();
