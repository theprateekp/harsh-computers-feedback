export const SHOP = {
  name: "Harsh Computers Laptop And Mobile Hub",
  localName: "हर्ष कंप्यूटर्स लैपटॉप एंड मोबाइल हब",
  logoPath: "/manus-storage/harsh-computers-logo-v2_c93cef98.jpg",
  category: "Computer repair service",
  rating: 4.9,
  reviewCount: 25,
  phone: "+91 98606 05025",
  phoneHref: "tel:+919860605025",
  address: "Khajina bihir chowk, Shop no. 8 Radha Krishna hights, 1435, Tilak Rd, Sadashiv Peth, Pune, Maharashtra 411030, India",
  mapsUrl: "https://maps.app.goo.gl/3WySPp64HW2M3nwk8",
  websiteUrl: "https://sites.google.com/view/harshcomputerspune/home.vdrh04y7gnvi",
  hours: [
    ["Monday", "10:00 AM–8:30 PM"],
    ["Tuesday", "10:00 AM–8:30 PM"],
    ["Wednesday", "10:00 AM–8:30 PM"],
    ["Thursday", "10:00 AM–8:30 PM"],
    ["Friday", "10:00 AM–8:30 PM"],
    ["Saturday", "10:00 AM–8:30 PM"],
    ["Sunday", "Closed"],
  ] as const,
} as const;

export const SERVICE_OPTIONS = [
  "Laptop repair",
  "Mobile repair",
  "Laptop / mobile sales",
  "Accessories",
  "Software or setup",
  "Other",
] as const;

export const FEEDBACK_TAGS = [
  "Fast turnaround",
  "Fair pricing",
  "Helpful staff",
  "Quality repair",
  "Needs follow-up",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type FeedbackTag = (typeof FEEDBACK_TAGS)[number];
