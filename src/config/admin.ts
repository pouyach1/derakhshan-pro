export type ContactRole = "Realtor" | "Builder" | "Client";

export type Contact = {
  id: string;
  name: string;
  role: ContactRole;
  city: string;
  avatar: string;
};

export type FeaturedProperty = {
  title: string;
  address: string;
  area: string;
  image: string;
  agent: Pick<Contact, "name" | "role" | "avatar">;
};

export type ViewedProperty = {
  id: string;
  title: string;
  location: string;
  image: string;
  rooms: string;
  size: string;
  finish: string;
  price: string;
  pricePerSqft: string;
  averageValue: string;
  planning: string;
};

export const ADMIN_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "Jayson Roy",
    role: "Realtor",
    city: "San Francisco",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c2",
    name: "Ava Collins",
    role: "Builder",
    city: "San Francisco",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c3",
    name: "Noah Bennett",
    role: "Client",
    city: "Oakland",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c4",
    name: "Mia Torres",
    role: "Realtor",
    city: "San Francisco",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c5",
    name: "Liam Park",
    role: "Builder",
    city: "Berkeley",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c6",
    name: "Sophia Chen",
    role: "Client",
    city: "San Francisco",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
];

export const FEATURED_PROPERTY: FeaturedProperty = {
  title: "Nova Residence",
  address: "Nova Residence, Apartment 12B, Victoria Road, Manchester, United Kingdom",
  area: "21k sq ft",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  agent: {
    name: "Jayson Roy",
    role: "Realtor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
};

export const MOST_VIEWED_PROPERTIES: ViewedProperty[] = [
  {
    id: "p1",
    title: "Apartment 52",
    location: "Victoria Quay, Manchester",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    rooms: "4 Rooms",
    size: "110 Sqm",
    finish: "Furnished",
    price: "$32,000 / sq ft",
    pricePerSqft: "$290",
    averageValue: "$1.2M",
    planning: "Luxury",
  },
  {
    id: "p2",
    title: "Aaradhya Homes",
    location: "Canal Street, Manchester",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    rooms: "3 Rooms",
    size: "95 Sqm",
    finish: "Semi-Furnished",
    price: "$28,400 / sq ft",
    pricePerSqft: "$265",
    averageValue: "$980K",
    planning: "Premium",
  },
  {
    id: "p3",
    title: "Skyline Loft 8",
    location: "Deansgate, Manchester",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    rooms: "2 Rooms",
    size: "78 Sqm",
    finish: "Furnished",
    price: "$41,200 / sq ft",
    pricePerSqft: "$340",
    averageValue: "$1.5M",
    planning: "Luxury",
  },
  {
    id: "p4",
    title: "Harbor View 14",
    location: "Salford Quays",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    rooms: "5 Rooms",
    size: "142 Sqm",
    finish: "Furnished",
    price: "$36,800 / sq ft",
    pricePerSqft: "$310",
    averageValue: "$1.8M",
    planning: "Luxury",
  },
  {
    id: "p5",
    title: "Elm Court Residences",
    location: "Northern Quarter",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    rooms: "3 Rooms",
    size: "102 Sqm",
    finish: "Unfurnished",
    price: "$24,900 / sq ft",
    pricePerSqft: "$240",
    averageValue: "$860K",
    planning: "Standard",
  },
];
