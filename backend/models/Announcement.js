const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

/* getAll filters on expiresAt and sorts pinned first. */
announcementSchema.index({ expiresAt: 1 });
announcementSchema.index({ pinned: -1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
