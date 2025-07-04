export const GAMES = [
  {
    id: "free-fire",
    name: "Free Fire",
    category: "Battle Royale",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "12.5k",
    gradient: "from-orange-400 to-red-500",
  },
  {
    id: "pubg",
    name: "PUBG",
    category: "Battle Royale",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "18.2k",
    gradient: "from-blue-400 to-purple-500",
  },
  {
    id: "cod",
    name: "Call of Duty",
    category: "FPS",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "9.8k",
    gradient: "from-green-400 to-teal-500",
  },
  {
    id: "apex",
    name: "Apex Legends",
    category: "Battle Royale",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "7.3k",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: "valorant",
    name: "Valorant",
    category: "FPS",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "5.9k",
    gradient: "from-red-400 to-yellow-500",
  },
  {
    id: "csgo",
    name: "CS:GO",
    category: "FPS",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60",
    players: "4.2k",
    gradient: "from-gray-400 to-blue-500",
  },
];

export const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

export const TOURNAMENT_MODES = [
  { id: "solo", name: "Solo" },
  { id: "duo", name: "Duo" },
  { id: "squad", name: "Squad" },
];

export const TOURNAMENT_STATUSES = [
  { id: "upcoming", name: "Upcoming", color: "orange" },
  { id: "live", name: "Live", color: "green" },
  { id: "ended", name: "Ended", color: "gray" },
];

export const TRANSACTION_TYPES = [
  { id: "deposit", name: "Deposit", color: "green" },
  { id: "withdrawal", name: "Withdrawal", color: "blue" },
  { id: "tournament_entry", name: "Tournament Entry", color: "red" },
  { id: "tournament_win", name: "Tournament Win", color: "green" },
  { id: "referral_bonus", name: "Referral Bonus", color: "purple" },
];
