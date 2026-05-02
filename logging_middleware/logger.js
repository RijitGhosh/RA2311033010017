const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaWppdGdob3NoNTNAZ21haWwuY29tIiwiZXhwIjoxNzc3NzA0ODYzLCJpYXQiOjE3Nzc3MDM5NjMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2MDJlMzE3Yi04ZWQzLTQ5NzctODk3MC1lNmRkZDc1NTE2ZjkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaWppdCBnaG9zaCIsInN1YiI6IjhmZmNkMGYzLTQyNTYtNGU2MS05NjcxLTUwNWQwYjBmOGM4NSJ9LCJlbWFpbCI6InJpaml0Z2hvc2g1M0BnbWFpbC5jb20iLCJuYW1lIjoicmlqaXQgZ2hvc2giLCJyb2xsTm8iOiJyYTIzMTEwMzMwMTAwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI4ZmZjZDBmMy00MjU2LTRlNjEtOTY3MS01MDVkMGIwZjhjODUiLCJjbGllbnRTZWNyZXQiOiJxQXdmWkFxSHFaVmZYbnhWIn0.RSkA5BKOe-GX6BkeD3euP-Ac3iQdCGCmMC0-KT0dm60";
async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log sent:", res.data);
  } catch (e) {
    console.log("log failed:", e.response?.data || e.message);
  }
}

module.exports = Log;
