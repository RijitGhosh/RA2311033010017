const express = require("express");
const axios = require("axios");
const Log = require("../logging_middleware/logger");

const app = express();

// middleware
app.use(async (req, res, next) => {
  await Log("backend", "info", "route", `${req.method} ${req.url}`);
  next();
});

app.get("/notifications", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "fetching");

    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications"
    );

    const data = response.data.notifications;

    const weights = { Placement: 3, Result: 2, Event: 1 };
    const now = new Date();

    const top = data
      .map(n => ({
        ...n,
        score:
          weights[n.Type] * 100000 -
          (now - new Date(n.Timestamp)) / 1000
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(top);
  } catch (e) {
    await Log("backend", "error", "controller", e.message);
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("running"));
