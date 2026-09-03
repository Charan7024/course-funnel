# The $100/Day System — Course Funnel

Opt-in page → video thank-you page → one-click waitlist for the free 5-video course.

## Files

- `index.html` — opt-in page (name + email)
- `thank-you.html` — video + waitlist button
- `api/subscribe.js` — subscribes + tags opt-ins (KIT_OPTIN_TAG_ID)
- `api/join-waitlist.js` — tags waitlist clicks (KIT_WAITLIST_TAG_ID)

## 1. Before deploying: add your YouTube video

Open `thank-you.html`, find this line:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID_HERE" ...
```

Replace `VIDEO_ID_HERE` with your actual unlisted YouTube video ID (the part after `watch?v=` in your video's URL).

## 2. Deploy to Vercel

Same process as your other landing pages:
1. Push these files to a new GitHub repo (keep the `api/` folder structure)
2. Import the repo in Vercel
3. Add environment variables in Project Settings > Environment Variables:

| Name                  | Value                          |
|------------------------|---------------------------------|
| `KIT_API_KEY`          | your existing Kit V4 API key   |
| `KIT_OPTIN_TAG_ID`     | 23066140                       |
| `KIT_WAITLIST_TAG_ID`  | 23066127                       |

4. Deploy

## 3. Test it

1. Open your live URL, submit the opt-in form
2. You should land on the thank-you page with the video playing
3. Click "Join The Waitlist" — it should show a confirmation without reloading the page
4. Check Kit: the subscriber should have both tags (opt-in tag from step 1, waitlist tag if they clicked the button)

## How it works

- The opt-in page tags everyone who signs up with `KIT_OPTIN_TAG_ID` (23066140), so you know who's seen the video pitch
- Their email is passed via URL to the thank-you page (`thank-you.html?email=...`)
- The waitlist button uses that email automatically — no second form, no retyping
- Clicking it calls `/api/join-waitlist`, which adds `KIT_WAITLIST_TAG_ID` (23066127) to their existing subscriber record

This means anyone in Kit tagged with the waitlist tag is your exact audience for launching the free course later.
