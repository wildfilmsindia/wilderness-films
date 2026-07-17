# Equipment page — how to add photos & details to an item

The equipment page (`/equipment`) lists every item from one file:

```
public/equipment.json
```

Clicking a row opens a popup with photos and full details. Items that don't
have photos/details yet still work — the popup simply shows "Image on request"
and whatever information exists.

## 1. Where the photos go

Put image files in this folder:

```
public/equipment/img/
```

- Up to **8 photos per item**.
- Recommended: JPG or WebP, about **1600 px on the longest edge** (photos
  straight off a phone are fine, just resize them so the page stays fast).
- Name them after the item so they're easy to find, e.g.
  `ultra-prime-180-1.jpg`, `ultra-prime-180-2.jpg`.

## 2. Adding details to an item

Open `public/equipment.json`, find the item by its `"name"`, and add any of
the fields below. **Every field is optional** — add only what you know.

```json
{
  "name": "ARRI Ultra Prime LDS 180mm",
  "cat": "Lenses",
  "cond": "Used",
  "sold": false,

  "brand": "ARRI / Zeiss",
  "model": "Ultra Prime LDS 180 mm",
  "mount": "PL",
  "quantity": 1,
  "location": "New Delhi, India",
  "description": "One or two sentences about the item.",
  "specs": {
    "Focal length": "180 mm",
    "Aperture": "T1.9"
  },
  "images": [
    "/equipment/img/ultra-prime-180-1.jpg",
    "/equipment/img/ultra-prime-180-2.jpg"
  ],
  "salePrice": null,
  "rentalPerDay": null
}
```

Notes:

- `images` — list the filenames you dropped into the folder, always starting
  with `/equipment/img/`. The first image is the main photo; the rest become
  thumbnails.
- `specs` — any extra label/value pairs you like ("Max fps": "150",
  "Includes": "2 batteries"…). They appear as extra rows in the popup.
- `salePrice` / `rentalPerDay` — numbers in rupees (e.g. `950000`). Leave as
  `null` (or delete the line) to show **no price** — the popup then stays
  enquiry-only, which is the default.
- Don't touch `name`, `cat`, `cond`, `sold` — those already drive the table.
- Mind the commas: every line inside `{ }` ends with a comma **except the
  last one**. If the page shows "Could not load equipment data" after an
  edit, a comma is usually the culprit — paste the file into
  https://jsonlint.com to find the exact spot.

## 3. Sharing a link to one item

Each item has its own link, e.g.

```
https://wildfilmsindia.com/equipment#item=arri-ultra-prime-lds-180mm
```

(the part after `#item=` is the item name in lowercase with dashes). Opening
that link shows the page with the item's popup already open. Note the link
changes if the item is renamed.

## Sample items (placeholder content — replace!)

These three items were filled in with **sample** descriptions, specs and
placeholder images so you can see the popup working. The details and the one
sample price (Fujinon) are guesses — please replace them with real
information and real photos:

1. "16 SR3 Advanced HD High Speed camera with magazine"
2. "ARRI Ultra Prime LDS 180mm"
3. "Fujinon XK6 PL (20-120) 4K with servo grip" — has a **sample**
   `salePrice`/`rentalPerDay` to demonstrate the price block

The placeholder images are the `.svg` files in `public/equipment/img/` —
delete them once real photos are in.
