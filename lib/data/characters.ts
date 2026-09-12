export interface Character {
  id: string;
  name: string;
  descriptor: string;
  image: string;
  status: "Live" | "Active";
  tagline?: string;
  interests?: string[];
}

export const CHARACTERS: Character[] = [
  {
    id: "elena",
    name: "Elena",
    descriptor: "Poetic, observant, quietly intoxicating",
    image: "/characters/character-01.webp",
    status: "Live",
    tagline: "I notice the things you never say out loud.",
    interests: ["Midnight philosophy", "Analog film", "Unspoken chemistry"],
  },
  {
    id: "julian",
    name: "Julian",
    descriptor: "Thoughtful, articulate, intensely present",
    image: "/characters/character-02.webp",
    status: "Live",
    tagline: "Give me your unfiltered mind. I have time.",
    interests: ["Deep conversation", "Late architecture", "Quiet loyalty"],
  },
  {
    id: "maya",
    name: "Maya",
    descriptor: "Playful, razor-witted, fiercely loyal",
    image: "/characters/character-03.webp",
    status: "Live",
    tagline: "Don't pretend you're not intrigued.",
    interests: ["Spontaneous banter", "Dark humor", "Electric tension"],
  },
  {
    id: "roman",
    name: "Roman",
    descriptor: "Enigmatic, protective, deeply discerning",
    image: "/characters/character-04.webp",
    status: "Live",
    tagline: "You don't have to carry everything alone tonight.",
    interests: ["Classical stoicism", "Night drives", "Steadfast devotion"],
  },
  {
    id: "clara",
    name: "Clara",
    descriptor: "Warm, philosophical, effortlessly magnetic",
    image: "/characters/character-05.webp",
    status: "Live",
    tagline: "Tell me what made your heart race today.",
    interests: ["Romantic literature", "Stargazing", "Emotional resonance"],
  },
  {
    id: "soren",
    name: "Soren",
    descriptor: "Refined, artistic, subtly provocative",
    image: "/characters/character-06.webp",
    status: "Live",
    tagline: "The world is noisy. Let's make our own quiet.",
    interests: ["Avant-garde art", "Intimate confessions", "Slow warmth"],
  },
];

