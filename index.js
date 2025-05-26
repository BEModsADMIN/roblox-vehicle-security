const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
app.use(express.json());

// ✅ Replace with your authorized game IDs
const allowedGames = ["7648652763", "87654321"]; // Place IDs as strings

// ✅ Replace with your actual Discord webhook URL
const webhookUrl = "https://discord.com/api/webhooks/1376535891597594645/TYPbUu_BxKGP0xfjwus1w13u7X11xsoskT6nklXC1xRslrwqjKU_X6glj-ms_Nf_j7EY";

app.post("/check", async (req, res) => {
  const { place_id } = req.body;

  console.log("Incoming request from game:", place_id);

  if (!place_id) {
    return res.status(400).json({ status: "error", message: "Missing place_id" });
  }

  const isAllowed = allowedGames.includes(place_id);

  if (!isAllowed) {
    console.log("Unauthorized game detected:", place_id);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🚨 Unauthorized Vehicle Usage Detected",
            color: 16711680,
            fields: [
              { name: "Place ID", value: place_id, inline: true },
              { name: "Time", value: new Date().toLocaleString(), inline: true }
            ],
            footer: { text: "Roblox Vehicle Protection System" }
          }]
        })
      });
    } catch (err) {
      console.error("Webhook failed:", err);
    }
  }

  return res.json({ status: isAllowed ? "allow" : "deny" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
