const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedGames = ["12345678", "87654321"]; // Replace with your actual game IDs

app.post("/check", (req, res) => {
  const { place_id } = req.body;

  if (!place_id) return res.status(400).json({ status: "error", message: "Missing place_id" });

  const isAllowed = allowedGames.includes(place_id);
  
  if (!isAllowed) {
    // Send Discord notification
    const webhookUrl = "YOUR_DISCORD_WEBHOOK_HERE";

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
