const axios = require("axios");

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

let TOKEN = "";
let fetchingToken = false;

async function getToken() {
  if (fetchingToken) return; // prevent duplicate calls
  fetchingToken = true;

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
  } finally {
    fetchingToken = false;
  }
}

async function Log(stack, level, pkg, message) {
  try {
    // always ensure token exists
    if (!TOKEN) {
      await getToken();
    }

    let res = await axios.post(
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
    // if token expired → refresh and retry once
    if (e.response?.data?.message === "invalid authorization token") {
      console.log("Token expired, fetching new one...");
      await getToken();

      try {
        const retry = await axios.post(
          LOG_URL,
          { stack, level, package: pkg, message },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("Log sent (retry):", retry.data);
      } catch (err) {
        console.log("log failed after retry:", err.response?.data || err.message);
      }
    } else {
      console.log("log failed:", e.response?.data || e.message);
    }
  }
}

module.exports = Log;
