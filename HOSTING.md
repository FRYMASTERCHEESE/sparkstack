# Put SparkStack on the internet (free, English only)

You do not pay a host. You need a free account so the site is not deleted.

Easiest path: **Netlify Drop**.  
Keep-forever path: **GitHub Pages**.

Do not upload your seed phrase or any private keys. Only these app files.

---

## Option A — Netlify (easiest, about 5 minutes)

1. Create a free account: https://app.netlify.com/signup  
   Use email or “Sign up with Google”.
2. Open: https://app.netlify.com/drop  
3. Drag the whole **sparkstack** folder onto the page  
   (the folder that contains `index.html`).
4. Wait a few seconds. You get a link like:  
   `https://something-random.netlify.app`
5. Open that link on your phone. That is your live app.
6. **Claim / save the site** while you are logged in so it is not deleted.  
   Unclaimed drops can disappear in about an hour.

To update later: open the same site in Netlify and drop the folder again.

---

## Option B — GitHub Pages (stays free, good long term)

No command line needed.

1. Create a free account: https://github.com/signup
2. Click the **+** (top right) → **New repository**.
3. Name it `sparkstack`.
4. Set it to **Public**.
5. Click **Create repository**.
6. Click **uploading an existing file**.
7. Drag these files in (not a nested extra folder):
   - index.html
   - styles.css
   - app.js
   - manifest.json
   - START_HERE.md
   - HOSTING.md
   - privacy.html
8. Click **Commit changes**.
9. Click **Settings** → **Pages**.
10. Under **Branch**, choose **main** and folder **/ (root)** → **Save**.
11. Wait one or two minutes. Your link will be:

`https://YOUR-USERNAME.github.io/sparkstack/`

Replace YOUR-USERNAME with your GitHub name.

---

## Check it worked

- You see “SparkStack” and the Earn / Wallet / Learn / Help tabs.
- Prices load if you have internet.
- Add to Home Screen on your phone if you want it to feel like an app.

If you see a blank page, you uploaded a folder inside a folder. Upload the files so `index.html` is at the top, not inside another `sparkstack` folder.

---

## I cannot click “Publish” for you

Netlify and GitHub are *your* accounts. After you have the live link, paste it here and I will tell you if anything looks wrong.
