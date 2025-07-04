import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    return "Past";
  }
  
  const days = Math.floor(diffInSeconds / 86400);
  const hours = Math.floor((diffInSeconds % 86400) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function generateTeamCode(): string {
  return 'TM' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function generateReferralCode(): string {
  return 'FF' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    'IN': '🇮🇳',
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'BR': '🇧🇷',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
  };
  return flags[countryCode] || '🏳️';
}

export function getGameIcon(gameName: string): string {
  const icons: Record<string, string> = {
    'Free Fire': '🔥',
    'PUBG': '🎯',
    'Call of Duty': '🎖️',
    'Apex Legends': '🎮',
    'Valorant': '⚡',
    'CS:GO': '🔫',
  };
  return icons[gameName] || '🎮';
}

export function getTournamentStatusColor(status: string): string {
  switch (status) {
    case 'live':
      return 'bg-green-500';
    case 'upcoming':
      return 'bg-orange-500';
    case 'ended':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

export function getTournamentStatusText(status: string): string {
  switch (status) {
    case 'live':
      return 'LIVE';
    case 'upcoming':
      return 'UPCOMING';
    case 'ended':
      return 'ENDED';
    default:
      return 'UNKNOWN';
  }
}
