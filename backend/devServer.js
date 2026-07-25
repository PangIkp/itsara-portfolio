const express = require("express");
const apiApp = require("./expressApp");

const port = process.env.PORT || 5000;
const app = express();

app.use("/api", apiApp);

app.listen(port, () => console.log(`Server running on port ${port}`));
