// Vercel serverless function
// Tags a subscriber as having joined the free 5-video course waitlist.
// Called via fetch from thank-you.html when they click the waitlist button.
//
// Required environment variables:
//   KIT_API_KEY           - your Kit V4 API key
//   KIT_WAITLIST_TAG_ID   - tag ID for course waitlist (23066127)

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Missing or invalid email." });
    return;
  }

  const apiKey = process.env.KIT_API_KEY;
  const waitlistTagId = process.env.KIT_WAITLIST_TAG_ID;

  if (!apiKey || !waitlistTagId) {
    res.status(500).json({ error: "Server is not configured yet." });
    return;
  }

  try {
    const kitRes = await fetch(`https://api.kit.com/v4/tags/${waitlistTagId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (!kitRes.ok) {
      const errorData = await kitRes.json().catch(() => ({}));
      res.status(500).json({ error: errorData.message || "Could not join the waitlist right now." });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not join the waitlist right now." });
  }
};
