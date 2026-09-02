// ── Shop product data ────────────────────────────────────────────────
// Two stores, kept intentionally separate so their catalogues can be
// edited independently later.

export interface ShopProduct {
  id: string
  name: string
  description: string
  price?: string           // freeform for now; e.g. "₹1,200"
  images: string[]
  tag?: string             // e.g. "New", "Limited", "Handmade"
}

export interface Store {
  slug: 'olive-wood' | 'himalayan-rapture'
  name: string
  intro?: string           // optional blurb under the store header
  hero: string             // storefront background image (first frame)
  heroSlideshow?: string[] // optional extra frames — the storefront panel
                           // cross-fades between these and the hero every few
                           // seconds. Include the hero itself in the list.
  accent: string           // hex — subtle per-store accent (dark theme still)
  // How product photos should sit in the card / lightbox frame.
  // 'cover' = fill (good for lifestyle shots), 'contain' = show whole item
  // (better for books, packaging, anything with important edges).
  fit?: 'cover' | 'contain'
  products: ShopProduct[]
}

// ── Store 01 — Olive Wood ──────────────────────────────
// The 18 olive-wood photos come in as ow-01..ow-18. Since each piece is one
// of a kind, the names are attractive but generic — rotated across the item
// families we actually stock (bowls, boards, spoons, coasters, etc.).
const OW_NAMES: { name: string; description: string; tag?: string }[] = [
  // ow-01: fish-skeleton trivet (six-slat body, live-edge head and tail)
  { name: 'Fish-Bone Trivet',            description: 'A striking fish-skeleton trivet carved from olive wood, with a live-edge head and tail bracketing six hand-cut ribs on wooden rods. Trivet for hot pots, or wall piece — either way a conversation starter.', tag: 'Handmade' },
  // ow-02: stack of live-edge log-slice coasters on a centre rod
  { name: 'Live-Edge Coaster Stack',     description: 'A stack of live-edge olive-wood coasters on a centre post — each coaster a slice of the branch, bark and all. Natural, rustic, and no two the same.' },
  // ow-03: kuksa-style wooden mug with double-hole handle
  { name: 'Kuksa Wooden Mug',            description: 'A Nordic-style kuksa cup hand-carved from a single olive-wood burl, with the traditional two-hole handle for a lanyard. For coffee, tea, or by the campfire.' },
  // ow-04: rustic live-edge chess table with side drawers
  { name: 'Rustic Chess Set with Drawers', description: 'A live-edge olive-wood chess table with an inlaid checkered board and a hidden drawer on either side for pieces. Comes with a full set of light and dark hand-turned pieces.' },
  // ow-05: small lidded pot with dipping spoon — honey / salt cellar
  { name: 'Honey Pot with Dipper',       description: 'A small barrel-turned pot in olive wood with a lift-off lid and matching dipper spoon. For honey, sugar, salt, or spices — whichever you use most at the table.' },
  // ow-06: large round shallow hand-turned bowl / fruit dish
  { name: 'Round Fruit Bowl',            description: 'A wide, hand-turned bowl in olive wood, deep enough for fruit or salad and beautiful enough to leave out. The grain moves through the whole piece.' },
  // ow-07: live-edge serving / cheese board with hole handle
  { name: 'Live-Edge Cheese Board',      description: 'A live-edge olive-wood serving board with a hand-cut hanging hole. As at home under a wheel of cheese as it is on the wall between uses.' },
  // ow-08: three-compartment mezze / appetiser dish
  { name: 'Three-Compartment Mezze Dish', description: 'A curved, three-compartment olive-wood dish for mezze, dips, olives and nuts. Carved from a single piece, the divisions follow the grain of the wood.' },
  // ow-09: long-handled soup ladle
  { name: 'Soup Ladle',                  description: 'A deep, long-handled ladle carved from olive wood — sized for stockpots, stews and sauces. Comfortable in the hand and built to last a lifetime.' },
  // ow-10: wall-mount spice rack with 8 lidded jars
  { name: 'Spice Rack with Eight Jars',  description: 'A two-tier olive-wood spice rack with eight lidded jars, each hand-turned so no two are quite alike. Wall-mount or free-standing on the counter.' },
  // ow-11: salad servers — long spoon + spatula pair
  { name: 'Salad Server Set',            description: 'A hand-carved pair of salad servers — spoon and spatula — in olive wood. Long, elegant and light enough to serve without effort.' },
  // ow-12: full-length olive-wood rolling pin with turned handles
  { name: 'Rolling Pin',                 description: 'A full-length rolling pin turned from a single billet of olive wood, with shaped end handles. Weighted just right for pastry, pasta, and rotis.' },
  // ow-13: hand-turned wine goblet / chalice
  { name: 'Wine Goblet',                 description: 'A hand-turned olive-wood goblet with a stem and base carved as one — a striking wine or ceremonial cup. Sold singly; the grain of each is one of a kind.' },
  // ow-14: smaller kuksa-style single-handle cup
  { name: 'Kuksa Camp Cup',              description: 'A smaller kuksa camp cup carved from a single piece of olive wood, with a signature drilled handle for a lanyard. Sturdy, warm in the hand, and made to travel.' },
  // ow-15: large rectangular serving tray with rounded handles
  { name: 'Large Serving Tray',          description: 'A rectangular serving tray in olive wood, with a raised rim and rounded end handles. Made from a mosaic of matched pieces, the grain running board to board.' },
  // ow-16: round coaster set stored in a cylindrical olive-wood holder
  { name: 'Round Coaster Set with Holder', description: 'A set of round olive-wood coasters that nest inside a matching cylindrical holder — the top coaster becomes the lid. Six pieces in one small, sculptural object.' },
  // ow-17: tall square utensil caddy / kitchen tool holder with slotted lid
  { name: 'Kitchen Utensil Caddy',       description: 'A tall square caddy for kitchen utensils, carved from olive wood with a slotted lid that keeps spoons and spatulas upright and separated. Handsome enough for the counter.' },
  // ow-18: beehive-shaped honey pot with dipper stick
  { name: 'Beehive Honey Pot',           description: 'A beehive-shaped honey pot hand-turned from olive wood, with a matching honey dipper. Ribbed like a traditional skep, warm-toned, and made to sit out on the table.' },
  // ow-19: shallow bowl, natural bark left on the rim
  { name: 'Bark Edge Bowl',              description: 'A shallow bowl carved from a cross-section of olive wood with the natural bark left intact around the rim. Concentric rings of grain ripple across the inside — the tree\'s own record of its years.' },
  // ow-20: large irregular burl slab with natural voids
  { name: 'Burl Live Edge Centrepiece Bowl', description: 'A large centrepiece cut from an olive-wood burl, its outline left exactly as the burl grew — lobed, uneven, pierced by natural openings. Pale, densely figured wood; a sculptural piece as much as a bowl.' },
  // ow-21: elongated organic slab board with dark bark edge
  { name: 'Live Edge Serving Board',     description: 'An elongated serving board that keeps the live edge of the plank, dark bark tracing one side. Dramatic streaked figure runs the length of the board — for bread, cheese or charcuterie.' },
  // ow-22: root-form piece with radiating arms and hollows
  { name: 'Root Centrepiece',            description: 'A sculptural centrepiece carved from an olive-tree root, arms radiating out from the core with shallow hollows between them. Entirely one of a kind — the form is whatever the root gave.' },
  // ow-23: tall tapered turned cylinder
  { name: 'Utensil Holder',              description: 'A tall, gently tapered holder turned from a single block of olive wood, with a fine incised band below the rim. Warm reddish figure and small burl knots throughout; keeps utensils upright on the counter.' },
  // ow-24: deep bowl, wavy bark rim
  { name: 'Rustic Live Edge Bowl',       description: 'A deep, rustic bowl with a wavy live edge and bark still clinging to the rim. The grain sweeps around the bowl in long dark bands — generous enough for fruit or salad.' },
]

export const OLIVE_WOOD: Store = {
  slug: 'olive-wood',
  name: 'Olive Wood',
  intro:
    'The Olive Wood Store — a collection of handcrafted, authentic olive-wood carved bowls, chess boards, spoons, coasters, ladles, trays and other homeware. Each piece is hand-carved from durable, sustainably sourced olive wood taken from 300–400-year-old trees that are no longer productive, sourced from groves on the southern Mediterranean coast. No two items are the same: the grain and finish of each depends on the tree, its aspect to the sea, moisture, light and other factors. Every piece is polished with olive oil and can be re-polished every few years. Being very strong wood, it can essentially last forever. All proceeds go towards our forest fire prevention fund, alongside a slew of other sylvan and reforestation initiatives in the Himalaya.',
  hero: '/shop/olive-wood/ow-15.jpg',
  // Storefront cycles through a curated set of the most photogenic pieces so
  // the panel doesn't feel static. Order = rotation order.
  heroSlideshow: [
    '/shop/olive-wood/ow-15.jpg', // large serving tray — dramatic grain
    '/shop/olive-wood/ow-04.jpg', // rustic chess set
    '/shop/olive-wood/ow-07.jpg', // live-edge cheese board
    '/shop/olive-wood/ow-10.jpg', // spice rack with jars
    '/shop/olive-wood/ow-17.jpg', // utensil caddy
    '/shop/olive-wood/ow-13.jpg', // wine goblet
    '/shop/olive-wood/ow-18.jpg', // beehive honey pot
    '/shop/olive-wood/ow-01.jpg', // fish-bone trivet
  ],
  accent: '#C6A15B',
  fit: 'contain',
  products: OW_NAMES.map((n, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      id: `ow-piece-${num}`,
      name: n.name,
      description: n.description,
      images: [`/shop/olive-wood/ow-${num}.jpg`],
      ...(i === 0 ? { tag: 'Handmade' } : {}),
    }
  }),
}

// ── Store 02 — Books / Merch ───────────────────────────
// Leads with the Himalayan Rapture book. Apparel remains as a companion
// item; more titles can be added to `products` over time.
// (Slug stays `himalayan-rapture` — it keys the asset paths and the panel.)
export const HIMALAYAN_RAPTURE: Store = {
  slug: 'himalayan-rapture',
  name: 'Books / Merch',
  hero: '/shop/himalayan-rapture/tshirt-back.jpg',
  accent: '#6B8FB4',
  fit: 'contain',
  products: [
    {
      id: 'hr-book-01',
      name: 'Himalayan Rapture — The Mountain Writings of Hari Dang',
      description:
        'A collection of the mountain writings of the late Hari Dang (1935–2016). Based on a book-length manuscript written in the 1960s as “The Himalayan Vision” but never published, this volume gathers his first college-era visits to Bandarpunch (1953, 1955), an adventure around Chiring We in Kumaon (1956), two expeditions to the Nanda Devi sanctuary (1960, 1961), his epic account of being benighted at the highest camp on the second Indian expedition to Everest (1962), and the last of three expeditions to then-unclimbed Jaonli in Garhwal with schoolboys (1966). Added to this are his thoughts on introducing young people to adventure, on Himalayan wildlife, and — an odd one out — a poem from a trip to Lahaul, the only record of the 1964 climb of M5 in the Mulkila range. From the vantage of later years, often spent in Landour looking out at the Garhwal Himalaya, he writes about what mountains meant to him, and why they should now be “unclimbed.”',
      price: '₹750',
      images: [
        '/shop/himalayan-rapture/book-1.jpg',
        '/shop/himalayan-rapture/book-2.jpg',
      ],
      tag: 'New',
    },
    {
      id: 'hr-book-02',
      name: 'Flowers of the Western Himalayas — Rupin Dang',
      description:
        'A field guide and photographic study of the wild flowers of the western Himalaya by Rupin Dang. Written for hikers, naturalists and armchair travellers, the book pairs Rupin\'s photographs from decades of expedition work with clear notes on where and when each species is found — from the meadows of Kashmir and Himachal through Uttarakhand and into the high alpine.',
      price: '₹1,200',
      images: [
        '/shop/himalayan-rapture/flowers-1.jpg',
      ],
    },
    {
      id: 'hr-tee-01',
      name: 'Himalayan Rapture Field Tee',
      description:
        'A small run of tees inspired by expeditions across the Himalaya — printed front and back with our mountain motif.',
      price: '₹400',
      // Back first — the printed mountain graphic is the side worth leading with.
      images: [
        '/shop/himalayan-rapture/tshirt-back.jpg',
        '/shop/himalayan-rapture/tshirt-front.jpg',
      ],
    },
  ],
}

export const STORES: [Store, Store] = [OLIVE_WOOD, HIMALAYAN_RAPTURE]
