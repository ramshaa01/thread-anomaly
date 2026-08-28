export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  colors: string[];
  sizes: string[];
  image: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "static",
    price: 999,
    category: "Graphic Tees",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder-1.jpg",
    description: "A pure white noise graphic on heavyweight cotton.",
    isNew: true,
  },
  {
    id: "p2",
    name: "feedback loop",
    price: 1299,
    salePrice: 999,
    category: "Oversized Fits",
    colors: ["Black", "Electric Green"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/placeholder-2.jpg",
    description: "Endless repetition. Oversized drop-shoulder fit.",
    isBestSeller: true,
  },
  {
    id: "p3",
    name: "off-grid",
    price: 899,
    category: "Graphic Tees",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder-3.jpg",
    description: "Disconnected and untraceable. Minimal glitch logo on chest.",
  },
  {
    id: "p4",
    name: "broadcast",
    price: 1499,
    category: "Music Collab Series",
    colors: ["Black", "Yellow"],
    sizes: ["M", "L", "XL"],
    image: "/placeholder-4.jpg",
    description: "High decibels. Part of the underground radio series.",
    isNew: true,
  },
  {
    id: "p5",
    name: "corrupted",
    price: 1199,
    category: "Limited Drops",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder-5.jpg",
    description: "File not found. Destroyed hem detailing.",
    isBestSeller: true,
  },
  {
    id: "p6",
    name: "bassline",
    price: 1299,
    category: "Music Collab Series",
    colors: ["Black"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/placeholder-6.jpg",
    description: "Feel it in your chest. Heavyweight 240GSM cotton.",
  },
  {
    id: "p7",
    name: "anomaly 01",
    price: 1599,
    category: "Limited Drops",
    colors: ["Electric Green"],
    sizes: ["M", "L", "XL"],
    image: "/placeholder-7.jpg",
    description: "The first irregularity. Strictly limited to 100 pieces.",
    isNew: true,
  },
  {
    id: "p8",
    name: "static bloom",
    price: 1099,
    salePrice: 899,
    category: "Graphic Tees",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder-8.jpg",
    description: "Digital flora. Screen printed with puff ink.",
    isBestSeller: true,
  },
  {
    id: "p9",
    name: "distortion tee",
    price: 1199,
    category: "Oversized Fits",
    colors: ["Black", "Yellow"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/placeholder-9.jpg",
    description: "Warped grid patterns on a boxy fit.",
  },
  {
    id: "p10",
    name: "glitchcore",
    price: 999,
    category: "Graphic Tees",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    image: "/placeholder-10.jpg",
    description: "For the system errors.",
  },
  {
    id: "p11",
    name: "frequency",
    price: 1399,
    category: "Music Collab Series",
    colors: ["Black", "Electric Green"],
    sizes: ["M", "L", "XL"],
    image: "/placeholder-11.jpg",
    description: "Tune in. Drop out.",
    isNew: true,
  },
  {
    id: "p12",
    name: "midnight signal",
    price: 1499,
    category: "Limited Drops",
    colors: ["Black"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "/placeholder-12.jpg",
    description: "Only broadcast after dark. Reflective 3M print.",
    isBestSeller: true,
  }
];
