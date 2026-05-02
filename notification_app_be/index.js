const express = require("express");
const axios = require("axios");
const Log = require("../logging_middleware/logger");

const app = express();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaWppdGdob3NoNTNAZ21haWwuY29tIiwiZXhwIjoxNzc3NzAzMTM4LCJpYXQiOjE3Nzc3MDIyMzgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyM2Q5NWNkNS0xZmE1LTQxMmQtOGJmNC1mNWRkNWFhMDVjNTgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaWppdCBnaG9zaCIsInN1YiI6IjhmZmNkMGYzLTQyNTYtNGU2MS05NjcxLTUwNWQwYjBmOGM4NSJ9LCJlbWFpbCI6InJpaml0Z2hvc2g1M0BnbWFpbC5jb20iLCJuYW1lIjoicmlqaXQgZ2hvc2giLCJyb2xsTm8iOiJyYTIzMTEwMzMwMTAwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI4ZmZjZDBmMy00MjU2LTRlNjEtOTY3MS01MDVkMGIwZjhjODUiLCJjbGllbnRTZWNyZXQiOiJxQXdmWkFxSHFaVmZYbnhWIn0.qR-3Pzn37hdsxTGpLDiAGeZ73uDX6oIBpaqF5Djj-ew";

// middleware
app.use(async (req, res, next) => {
  await Log("backend", "info", "route", `${req.method} ${req.url}`);
  next();
});

app.get("/notifications", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "fetching");

    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
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
    console.log(e.response?.data || e.message); // 👈 helps debug
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("running"));
