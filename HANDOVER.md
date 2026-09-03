# Handover — wildfilmsindia.com

Everything needed to keep this website running. Written for whoever takes it
over, technical or not.

Last updated: 3 September 2026

---

## 1. The short version

The website is a Next.js application. It lives on GitHub, and Vercel rebuilds
and publishes it automatically every time something changes on the `main`
branch.

Day-to-day content — equipment listings and shop products — is edited through a
web form at **app.pagescms.org**. No developer needed. See `ADMIN-GUIDE.md`.

**The most important thing to understand:** all content is stored as ordinary
files inside the GitHub repository (`public/equipment.json` and
`src/data/shop.json`). It is not locked inside any third-party service. If
every tool listed below disappeared tomorrow, the website and all its content
would still be intact and any web developer could pick it up.

That was a deliberate choice. Keep it that way.

---

## 2. Accounts and who owns what

| Service | What it does | Account | Notes |
|---|---|---|---|
| **GitHub** | Stores the website code and all content | Organisation: `wildfilmsindia` | It is an **organisation**, not a personal account, so access survives staff changes. Repo: `wildfilmsindia/wilderness-films` |
| **Vercel** | Hosts the live website | Team: `wfil-s-projects` | Rebuilds automatically from GitHub. Nothing to run manually. |
| **Pages CMS** | The web admin form | Sign in with GitHub | Free. Nothing hosted by us. |
| **Domain** | wildfilmsindia.com | GoDaddy (DNS), Vercel (hosting) | Sister/state domains are on Cloudflare DNS. |

### Do this before anyone leaves

1. **Check the GitHub organisation has at least two Owners.**
   github.com/orgs/wildfilmsindia/people — if only one person is Owner and they
   leave, the company can be locked out. Add a second.
2. **Check the Vercel team has more than one member**, for the same reason.
3. **Confirm who controls the domain registrar login.** This is the single
   hardest thing to recover if lost.
4. Make sure billing (if any) is not on a personal card.

---

## 3. How to change things

| I want to… | How |
|---|---|
| Add / edit / remove equipment | app.pagescms.org → Equipment. See `ADMIN-GUIDE.md`. |
| Add / edit shop products | app.pagescms.org → Shop stores |
| Mark an item sold | Equipment → open item → Sold toggle |
| Change page layout, design, add sections | Needs a developer |

After any save, the site rebuilds and is live in about 2 minutes.

---

## 4. Where things live

```
public/equipment.json          The equipment catalogue (321 items)
src/data/shop.json             Both shop stores and their products
public/equipment/img/          Equipment photos
public/equipment/img/uploads/  Where the web admin puts new photos
public/shop/                   Shop photos
src/                           The website code
.pages.yml                     Config for the web admin form
ADMIN-GUIDE.md                 How to use the admin (non-technical)
```

---

## 5. Photos — the one rule

**Resize to about 1600 pixels on the long edge before uploading.**

On a Mac: select files in Finder → right-click → Quick Actions → Convert Image
→ JPEG, size Large.

Why it matters: photos are stored in the code repository, and a repository
keeps every version of every file **permanently**. A 6 MB photo uploaded by
mistake is 6 MB in the repository forever, even if deleted afterwards. Large
photos also make the site slow, which Google penalises.

Current state: about 1,100 photos, 213 MB. The repository is around 324 MB.

**When to act:** if the repository passes roughly 1 GB, or deploys start taking
noticeably longer, it is worth having a developer move photos to dedicated
image hosting. Not urgent — at the current rate that is years away. Do not do
it pre-emptively; it would add an external account that can lapse and break
every image on the site at once.

---

## 6. If something breaks

**A change does not appear on the site**
Wait 3 minutes, then hard-refresh (Cmd+Shift+R). Still nothing → check
vercel.com → wilderness-films → Deployments. A red entry means the build
failed; click it to see why. The most common cause is a duplicate shop product
**ID**.

**A build fails and you cannot fix it**
Vercel keeps every previous version. Open the last working deployment and use
**⋯ → Promote to Production**. The site reverts immediately. Then get help.

**The admin form stops loading**
The website is unaffected — only the editing tool is down. Content can still be
edited directly on GitHub by opening `public/equipment.json`. If Pages CMS ever
shuts down permanently, any git-based CMS can be pointed at the same files.

**The whole site is down**
Check vercel.com first (deployment failed?), then the domain registrar (has the
domain expired?). Domain expiry is the most common cause of total outage.

---

## 7. Known outstanding work

- **19 folders of photos are not yet on the site** (~115 photos). They are in
  `ITEMS NOT UPLOADED` on the equipment hard drive. Each is held back because
  the photographs do not show a model badge or serial plate, so the item could
  not be identified with confidence. They need someone who knows the equipment,
  or fresh photos of the labels.
- **69 listings still show the supplier's stock photography** rather than our
  own, because no photograph of those items exists on the drive.
- **116 listings have no photograph at all.**
- Two catalogue entries carry `wfi-` filenames but are actually manufacturer
  stock images (`wfi-19-1.jpg`, `wfi-19-2.jpg`). Cosmetic, but the `wfi-`
  prefix normally means "our own photo", so do not trust it blindly for audits.

---

## 8. Principles worth keeping

1. **Keep content in the repository.** It is the reason this site is
   recoverable. Resist moving it into a hosted service that can lapse.
2. **Never rename a listing based on a folder name alone.** Folder names on the
   equipment drive are informal shorthand and are sometimes wrong. Trust the
   model badge in the photograph, or the original listing.
3. **Prefer marking items Sold over deleting them.** Sold listings keep
   bringing people in from Google.
4. **Two people should always have Owner access** to GitHub, Vercel and the
   domain registrar.
