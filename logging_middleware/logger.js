const axios = require("axios");

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

let TOKEN = "";

// get fresh token every time
async function getToken() {
  try {
    const res = await axios.post(AUTH_URL, {
      email: "rijitghosh53@gmail.com",
      name: "Rijit Ghosh",
      mobileNo: "7501897104",
      githubUsername: "RijitGhosh",
      rollNo: "RA2311033010017",
      accessCode: "QkbpxH",
      clientID: "8ffcd0f3-4256-4e61-9671-505d0b0f8c85",
      clientSecret: "qAwfZAqHqZVfXnxV"
    });

    TOKEN = res.data.access_token;
  } catch (err) {
    console.log("Token fetch failed:", err.response?.data || err.message);
  }
}

async function Log(stack, level, pkg, message) {
  try {
    // ALWAYS fetch fresh token
    await getToken();

    const res = await axios.post(
      LOG_URL,
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
