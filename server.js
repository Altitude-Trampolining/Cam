const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "change-this-to-a-long-random-string";
let commandQueue = [];

// Website / tools send commands here
app.post("/command", (req, res) => {
  const key = req.headers["x-api-key"] || req.query.key;
  if (key !== SECRET_KEY) {
    return res.status(403).json({ error: "Invalid key" });
  }

  const cmd = req.body;
  if (!cmd || !cmd.type) {
    return res.status(400).json({ error: "Missing command type" });
  }

  commandQueue.push(cmd);
  console.log("Queued:", cmd.type, cmd);
  res.json({ success: true });
});

// Roblox polls this
app.get("/commands", (req, res) => {
  if (req.query.key !== SECRET_KEY) {
    return res.status(403).json({ error: "Invalid key" });
  }

  const commands = [...commandQueue];
  commandQueue = [];
  res.json(commands);
});

app.get("/", (req, res) => {
  res.send("Gybasoft Camera Control Backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
