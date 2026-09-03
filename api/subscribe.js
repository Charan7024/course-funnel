// Vercel serverless function
// Adds a submitted email to Kit as a subscriber, tagged as having opted in
// for "The $100/Day System" framework video.
//
// Required environment variables (Vercel Project Settings > Environment Variables):
//   KIT_API_KEY        - your Kit V4 API key
//   KIT_OPTIN_TAG_ID    - tag ID for framework video opt-ins (23066140)

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email } = req.body || {};

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Please enter your name." });
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const apiKey = process.env.KIT_API_KEY;
  const optinTagId = process.env.KIT_OPTIN_TAG_ID;

  if (!apiKey) {
    res.status(500).json({ error: "Server is not configured yet. Missing Kit credentials." });
    return;
  }

  try {
    const kitRes = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email, first_name: name }),
    });

    if (!kitRes.ok) {
      const errorData = await kitRes.json().catch(() => ({}));
      res.status(500).json({ error: errorData.message || "Could not subscribe right now. Please try again shortly." });
      return;
    }

    if (optinTagId) {
      await fetch(`https://api.kit.com/v4/tags/${optinTagId}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({ email_address: email }),
      }).catch(() => {
        // Tagging failure shouldn't block the subscribe success response.
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not subscribe right now. Please try again shortly." });
  }
};
