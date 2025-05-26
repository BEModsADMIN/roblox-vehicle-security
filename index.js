const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedGames = ["7648652763"]; // Replace with your actual game IDs

app.post("/check", (req, res) => {
  const { place_id } = req.body;

  if (!place_id) return res.status(400).json({ status: "error", message: "Missing place_id" });

  const isAllowed = allowedGames.includes(place_id);
  
  if (!isAllowed) {
    // Send Discord notification
    const webhookUrl = "https://discord.com/api/webhooks/1376535891597594645/TYPbUu_BxKGP0xfjwus1w13u7X11xsoskT6nklXC1xRslrwqjKU_X6glj-ms_Nf_j7EY";

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🚨 Unauthorized Use Detected",
          color: 16711680,
          fields: [
            { name: "Game ID", value: place_id },
            { name: "Time", value: new Date().toLocaleString() }
          ]
        }]
      })
    }).catch(err => console.log("Webhook error:", err));
  }

  res.json({ status: isAllowed ? "allow" : "deny" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
