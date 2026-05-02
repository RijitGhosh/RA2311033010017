const axios = require("axios");

const TOKEN = "PASTE_YOUR_TOKEN_HERE";

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
  } catch (e) {
    console.log("log failed");
  }
}

module.exports = Log;
