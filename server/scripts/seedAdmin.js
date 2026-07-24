// Run once with: node scripts/seedAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_DATA = {
  name: "Muditha Kandewatta",
  studentId: "s17488",
  email: "admin@unifind.lk",
  password: "admin1234",
  role: "admin"
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding.");

    const existing = await User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      process.exit(0);
    }

    const admin = new User(ADMIN_DATA);
    await admin.save();

    console.log("Admin user created successfully:");
    console.log(`  Email:      ${admin.email}`);
    console.log(`  Student ID: ${admin.studentId}`);
    console.log(`  Role:       ${admin.role}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();