/* ==========================================================================
   Savor — front-end content data
   This file holds all repeatable content so the markup stays clean.
   Swap any entry to update the site — no build step required.
   ========================================================================== */

const IMG = (id, w) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w || 800}&q=80`;

/* --------------------------------------------------------------------------
   MENU
   categories: array of { id, label }
   items:      array of { cat, name, desc, price, img, badges[] }
   badges:     "veg" | "vegan" | "spicy" | "new" | "chef"
   -------------------------------------------------------------------------- */
const MENU_CATEGORIES = [
  { id: 'starters', label: 'Starters' },
  { id: 'mains',    label: 'Mains' },
  { id: 'pasta',    label: 'Pasta & Rice' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks',   label: 'Drinks' }
];

const MENU_ITEMS = [
  {
    cat: 'starters',
    name: 'Burrata & Heirloom Tomato',
    desc: 'Creamy burrata, marinated heirloom tomatoes, basil oil and toasted sourdough crumbs.',
    price: '$16',
    img: IMG('photo-1546069901-ba9599a7e63c', 300),
    badges: ['veg']
  },
  {
    cat: 'starters',
    name: 'Seared Scallops',
    desc: 'Hand-dived scallops, cauliflower velouté, brown butter and crisp capers.',
    price: '$22',
    img: IMG('photo-1592985684811-6c0f98adb014', 300),
    badges: ['chef']
  },
  {
    cat: 'starters',
    name: 'Charred Padrón Peppers',
    desc: 'Blistered peppers, smoked sea salt, lemon zest and house aioli.',
    price: '$12',
    img: IMG('photo-1512621776951-a57141f2eefd', 300),
    badges: ['vegan', 'spicy']
  },
  {
    cat: 'mains',
    name: '48-Hour Aged Ribeye',
    desc: 'Charcoal-seared ribeye, bone-marrow butter, smoked salt and red-wine reduction.',
    price: '$46',
    img: IMG('photo-1544025162-d76694265947', 300),
    badges: ['chef']
  },
  {
    cat: 'mains',
    name: 'Miso Glazed Black Cod',
    desc: 'Three-day marinated cod, pickled ginger, charred spring onion and dashi broth.',
    price: '$38',
    img: IMG('photo-1519708227418-c8fd9a32b7a2', 300),
    badges: ['new']
  },
  {
    cat: 'mains',
    name: 'Harissa Roast Cauliflower',
    desc: 'Whole roasted cauliflower, harissa glaze, tahini yoghurt and pomegranate.',
    price: '$24',
    img: IMG('photo-1540189549336-e6e99c3679fe', 300),
    badges: ['veg', 'spicy']
  },
  {
    cat: 'mains',
    name: 'Herb Roast Free-Range Chicken',
    desc: 'Half chicken, thyme jus, confit garlic and buttered seasonal greens.',
    price: '$32',
    img: IMG('photo-1598103442097-8b74394b95c6', 300),
    badges: []
  },
  {
    cat: 'pasta',
    name: 'Truffle Tagliatelle',
    desc: 'Hand-rolled pasta, aged parmesan cream and shaved winter truffle.',
    price: '$34',
    img: IMG('photo-1546833999-b9f581a1996d', 300),
    badges: ['veg', 'chef']
  },
  {
    cat: 'pasta',
    name: 'Lobster Linguine',
    desc: 'Native lobster, white wine, chilli, cherry tomato and fresh basil.',
    price: '$42',
    img: IMG('photo-1563379926898-05f4575a45d8', 300),
    badges: ['spicy']
  },
  {
    cat: 'pasta',
    name: 'Wild Mushroom Risotto',
    desc: 'Carnaroli rice, forest mushrooms, thyme and 24-month parmesan.',
    price: '$28',
    img: IMG('photo-1476124369491-e7addf5db371', 300),
    badges: ['veg']
  },
  {
    cat: 'desserts',
    name: 'Valrhona Fondant',
    desc: 'Molten dark chocolate, salted caramel and vanilla-bean gelato.',
    price: '$16',
    img: IMG('photo-1551024506-0bccd828d307', 300),
    badges: ['veg', 'chef']
  },
  {
    cat: 'desserts',
    name: 'Pistachio Basque Cheesecake',
    desc: 'Burnt-top cheesecake, pistachio praline and creme fraiche.',
    price: '$15',
    img: IMG('photo-1563805042-7684c019e1cb', 300),
    badges: ['veg', 'new']
  },
  {
    cat: 'desserts',
    name: 'Seasonal Sorbet Trio',
    desc: 'Three scoops of house sorbet made from the ripest fruit of the week.',
    price: '$11',
    img: IMG('photo-1488900128323-21503983a07e', 300),
    badges: ['vegan']
  },
  {
    cat: 'drinks',
    name: 'Smoked Old Fashioned',
    desc: 'Bourbon, maple, aromatic bitters, oak smoke and orange oil.',
    price: '$18',
    img: IMG('photo-1514362545857-3bc16c4c7d1b', 300),
    badges: []
  },
  {
    cat: 'drinks',
    name: 'Chateau Rouge Reserve',
    desc: 'A bold Bordeaux blend by the glass, decanted at the table.',
    price: '$21',
    img: IMG('photo-1510812431401-41d2bd2722f3', 300),
    badges: ['chef']
  },
  {
    cat: 'drinks',
    name: 'Garden Botanical Spritz',
    desc: 'Zero-proof spritz with elderflower, cucumber and rosemary.',
    price: '$12',
    img: IMG('photo-1497534446932-c925b458314e', 300),
    badges: ['vegan', 'new']
  }
];

/* Badge labels shown on menu cards ---------------------------------------- */
const MENU_BADGES = {
  veg:    { label: 'Veg',      cls: 'badge--veg' },
  vegan:  { label: 'Vegan',    cls: 'badge--veg' },
  spicy:  { label: 'Spicy',    cls: 'badge--spicy' },
  new:    { label: 'New' },
  chef:   { label: "Chef's Pick" }
};

/* --------------------------------------------------------------------------
   GALLERY — size: "" | "wide" | "tall"
   -------------------------------------------------------------------------- */
const GALLERY = [
  { img: IMG('photo-1517248135467-4c7edcad34c4', 1100), cap: 'The main dining room',      size: 'wide' },
  { img: IMG('photo-1414235077428-338989a2e8c0', 800),  cap: 'Evening service',          size: '' },
  { img: IMG('photo-1551218808-94e220e084d2', 800),     cap: 'Plating the tasting menu', size: 'tall' },
  { img: IMG('photo-1470337458703-46ad1756a187', 800),  cap: 'Morning prep',             size: '' },
  { img: IMG('photo-1424847651672-bf20a4b0982b', 1100), cap: 'Private dining room',      size: 'wide' },
  { img: IMG('photo-1559339352-11d035aa65de', 800),     cap: 'The bar',                  size: '' },
  { img: IMG('photo-1551024506-0bccd828d307', 800),     cap: 'Sweet finishes',           size: '' },
  { img: IMG('photo-1555939594-58d7cb561ad1', 800),     cap: 'From the grill',           size: '' }
];

/* --------------------------------------------------------------------------
   TESTIMONIALS
   -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  {
    quote: 'The ribeye alone was worth the trip. Service felt invisible yet always present - that is true hospitality.',
    name: 'Amara Whitfield',
    role: 'Food Critic, The Riverside Review',
    avatar: IMG('photo-1494790108377-be9c29b29330', 160),
    stars: 5
  },
  {
    quote: 'We booked for an anniversary and left planning the next visit. Every plate looked like a small piece of art.',
    name: 'Daniel Okafor',
    role: 'Regular guest',
    avatar: IMG('photo-1500648767791-00dcc994a43e', 160),
    stars: 5
  },
  {
    quote: 'A rare place that balances technique with genuine warmth. The tasting menu is beautifully paced.',
    name: 'Sofia Berglund',
    role: 'Travel writer',
    avatar: IMG('photo-1438761681033-6461ffad8d80', 160),
    stars: 5
  },
  {
    quote: 'Hands down the best pasta I have eaten outside of Italy. The truffle tagliatelle is unforgettable.',
    name: 'Marco Ferretti',
    role: 'Chef and restaurateur',
    avatar: IMG('photo-1507003211169-0a1dd7228f2d', 160),
    stars: 5
  }
];

