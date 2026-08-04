require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("UniFind API is running");
});

// ---- Routes ----
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/items", require("./routes/item.routes"));
// app.use("/api/claims", require("./routes/claim.routes"));
// app.use("/api/moderation", require("./routes/moderation.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/announcements", require("./routes/announcement.routes"));
app.use("/api/categories", require("./routes/category.routes"));

const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 UniFind Server Started Successfully on port ${PORT}`);
});