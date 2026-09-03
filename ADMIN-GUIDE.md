# Updating the website yourself

You no longer need a developer to add equipment or shop products. Everything is
edited through a web form, from any browser.

---

## One-time setup (about 5 minutes)

1. Go to **https://app.pagescms.org**
2. Click **Sign in with GitHub** and use the `wildfilmsindia` account.
3. GitHub will ask you to authorise Pages CMS. Grant it access to the
   **wilderness-films** repository (you can pick just that one repo).
4. Pages CMS will show the repository. Open it.

You will see two sections in the sidebar: **Equipment** and **Shop stores**.

Bookmark that page. That is your admin panel from now on.

---

## Adding a new piece of equipment

1. Open **Equipment** in the sidebar.
2. Click **Add an entry** (top right).
3. Fill in:

   | Field | What to put |
   |---|---|
   | **Item name** | The full model name, e.g. `Canon HJ22 x 7.6 B IASE Lens`. This is the headline on the site, so write it exactly as you want it read. |
   | **Category** | Pick from the dropdown. |
   | **Brand** | `Canon`, `Sony`, `ARRI`, etc. Powers the brand filter. |
   | **Condition** | New or Used. |
   | **Description** | One or two sentences. |
   | **Photos** | Click to upload. **The first photo is the one shown on the catalogue card**, so put the best one first. |
   | **Sold** | Leave off. Switch on when it sells — the item stays listed with a "Sold" badge. |
   | Mount / Source URL | Optional, leave blank. |

4. Click **Save**.

The site rebuilds automatically. Your change is live in **about 2 minutes**.

### Editing or removing an item
Click any row in the Equipment list to edit it. To remove an item, open it and
use the **⋯** menu → Delete.

> **Prefer marking things Sold over deleting them.** Sold items still bring
> people to the site through Google, and they show buyers the calibre of kit
> you handle.

---

## Adding a shop product

1. Open **Shop stores** in the sidebar.
2. You will see the two stores: **Olive Wood** and **Books / Merch**.
3. Expand the store you want, scroll to **Products**, click **Add**.
4. Fill in:

   | Field | What to put |
   |---|---|
   | **ID** | A short unique code, e.g. `ow-piece-25`. Just carry on from the last number. It must not repeat. |
   | **Product name** | e.g. `Olive Wood Salad Bowl` |
   | **Description** | A few sentences. |
   | **Price** | Free text, e.g. `₹1,200`. Leave blank to show "Enquire for price". |
   | **Photos** | Upload. Two or more gets a "N PHOTOS" badge and hover-swap on the card. |
   | **Badge** | Optional corner label, e.g. `New` or `Handmade`. |

5. **Save.** Live in ~2 minutes.

You can also change a store's name, intro text, accent colour and the
storefront slideshow images from the same screen.

---

## Photos — the one rule that matters

**Resize photos to roughly 1600 pixels on the long edge before uploading.**

Straight off a camera or phone a photo can be 5–8 MB. On the website that is
wasted — it will be displayed at about 1600px anyway, and huge files make your
pages slow to load, which Google penalises.

Easiest way on a Mac, no software needed:

1. Select the photos in Finder.
2. Right-click → **Quick Actions** → **Convert Image**.
3. Choose **JPEG**, Image Size: **Large**.
4. It creates resized copies. Upload those.

Every photo currently on the site is 1600px, so matching that keeps things
consistent.

---

## What not to touch

Inside **Shop stores**, leave the **Slug** field alone (`olive-wood`,
`himalayan-rapture`). It is wired into the page layout and the image folders —
changing it will break the store.

Everything else is safe. If something goes wrong, every save is a GitHub
commit, so any change can be undone.

---

## If a change does not appear

1. Wait 3 minutes — the rebuild takes a couple of minutes.
2. Hard-refresh the page: **Cmd + Shift + R**.
3. Check https://vercel.com → wilderness-films → Deployments. A red entry means
   the build failed; the most likely cause is a duplicate shop product **ID**.

---

## One thing to keep an eye on

Photos are stored inside the website's code repository. That is simple and free
and works well, but the repository is already about 220 MB and every photo adds
to it permanently.

That is fine for now, and fine for a few hundred more photos. If deploys start
feeling slow, or you get past roughly 500 MB, it is worth moving photos to
dedicated image hosting (Cloudinary and Vercel Blob both have free tiers). That
is a developer job, but it is not urgent — just a note so it does not surprise
you later.

---

## Summary

| Task | Where |
|---|---|
| Add / edit / remove equipment | app.pagescms.org → Equipment |
| Add / edit shop products | app.pagescms.org → Shop stores |
| Change store name, intro, slideshow | app.pagescms.org → Shop stores |
| Mark something sold | Equipment → open item → Sold toggle |

Anything beyond this — page layout, design, new sections — still needs a
developer.
