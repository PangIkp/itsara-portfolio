const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/contentRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const activityRoutes = require("./routes/activityRoutes");
const skillRoutes = require("./routes/skillRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", contentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/skills", skillRoutes);
app.use("/contact", contactRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
