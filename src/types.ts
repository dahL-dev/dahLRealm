export interface Player {
  id: string;
  name: string;
  steamId?: string;
  connectedMinutes: number;
  ping: number;
  biome: 'Meadows' | 'Black Forest' | 'Swamp' | 'Mountains' | 'Plains' | 'Mistlands' | 'Ashlands' | 'Ocean';
  role?: 'Viking' | 'Jarl' | 'Admin';
}

export interface BossProgress {
  id: string;
  name: string;
  biome: string;
  defeated: boolean;
  defeatedDate?: string;
  trophy: string;
}

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: 'join' | 'leave' | 'save' | 'raid' | 'boss' | 'system';
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'alert';
}

export interface ServerHistoryPoint {
  time: string;
  players: number;
  ping: number;
  cpu: number;
}

export interface ValheimServerConfig {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  gamePort: number;
  queryPort: number;
  worldName: string;
  worldSeed: string;
  version: string;
  maxPlayers: number;
  isPasswordProtected: boolean;
  passwordHint?: string;
  crossplayEnabled: boolean;
  location: string;
  modded: boolean;
  modpackUrl?: string;
  queryMode: 'live' | 'showcase' | 'manual';
}

export interface ManualStatsOverrides {
  online?: boolean;
  ping?: number;
  tickrate?: number;
  currentDay?: number;
  timeOfDay?: 'Dawn' | 'Day' | 'Dusk' | 'Night';
  uptimeSeconds?: number;
  cpuUsage?: number;
  memoryUsageMb?: number;
  memoryTotalMb?: number;
  activePlayerCount?: number;
  players?: Player[];
  bosses?: BossProgress[];
  queryError?: string;
  customStatusBanner?: string;
}

export interface ValheimServerStatus {
  online: boolean;
  isLiveA2S: boolean;
  queryError?: string;
  lastChecked: string;
  ping: number; // ms
  tickrate: number; // Hz
  uptimeSeconds: number;
  currentDay: number;
  timeOfDay: 'Dawn' | 'Day' | 'Dusk' | 'Night';
  cpuUsage: number; // %
  memoryUsageMb: number;
  memoryTotalMb: number;
  players: Player[];
  activePlayerCount: number;
  bosses: BossProgress[];
  recentEvents: ServerEvent[];
  history: ServerHistoryPoint[];
  rawA2sData?: {
    name?: string;
    map?: string;
    numplayers?: number;
    maxplayers?: number;
    ping?: number;
  };
}

export interface PlannedServer {
  id: string;
  name: string;
  game: string;
  badge: string;
  description: string;
  status: 'planned' | 'testing' | 'voting';
  votes: number;
  targetDate?: string;
}

export type UserRole = 'admin' | 'member';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  password?: string;
  avatarSeed?: string;
  createdAt: string;
  vikingClan?: string;
}

