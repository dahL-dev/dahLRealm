/**
 * Cloudflare Worker entry point for dahLRealm
 * Handles edge API requests (/api/servers) and serves static assets.
 */

interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

let valheimConfig = {
  id: 'valheim-main',
  name: 'dahLRealm | Valheim Dedicated',
  tagline: 'Viking Survival Realm • Norse Legends & Building',
  domain: 'valheim.dahlrealm.com',
  gamePort: 2456,
  queryPort: 2457,
  worldName: 'Dahlgard',
  worldSeed: 'dahLRealm99',
  version: '0.219.16 (Latest Public)',
  maxPlayers: 10,
  isPasswordProtected: true,
  passwordHint: 'Ask on dahLRealm Discord',
  crossplayEnabled: true,
  location: 'US East (Low Latency)',
  modded: false,
  modpackUrl: '',
  queryMode: 'showcase' as 'live' | 'showcase',
};

const currentPlayers = [
  {
    id: 'p-1',
    name: 'Skjaldborg',
    steamId: '76561198012345678',
    connectedMinutes: 142,
    ping: 24,
    biome: 'Mistlands',
    role: 'Jarl',
  },
  {
    id: 'p-2',
    name: 'Astrid_Shield',
    steamId: '76561198087654321',
    connectedMinutes: 68,
    ping: 32,
    biome: 'Plains',
    role: 'Viking',
  },
  {
    id: 'p-3',
    name: 'Einar_Ironbreaker',
    steamId: '76561198099887766',
    connectedMinutes: 35,
    ping: 19,
    biome: 'Black Forest',
    role: 'Viking',
  },
];

const bossList = [
  { id: 'b1', name: 'Eikthyr', biome: 'Meadows', defeated: true, defeatedDate: 'Day 12', trophy: 'Antler Crown' },
  { id: 'b2', name: 'The Elder', biome: 'Black Forest', defeated: true, defeatedDate: 'Day 48', trophy: 'Swamp Key' },
  { id: 'b3', name: 'Bonemass', biome: 'Swamp', defeated: true, defeatedDate: 'Day 104', trophy: 'Wishbone' },
  { id: 'b4', name: 'Moder', biome: 'Mountains', defeated: true, defeatedDate: 'Day 182', trophy: 'Dragon Tear' },
  { id: 'b5', name: 'Yagluth', biome: 'Plains', defeated: true, defeatedDate: 'Day 260', trophy: 'Torn Spirit' },
  { id: 'b6', name: 'The Queen', biome: 'Mistlands', defeated: false, trophy: 'Majestic Carapace' },
  { id: 'b7', name: 'Fader', biome: 'Ashlands', defeated: false, trophy: 'Bell Fragment' },
];

const plannedServers = [
  {
    id: 's-minecraft',
    name: 'dahLRealm | Vanilla+ SMP',
    game: 'Minecraft (Fabric 1.21)',
    badge: 'In Planning',
    description: 'Hermitcraft-style cooperative survival realm with optimized tick engine and Proximity Voice.',
    status: 'planned',
    votes: 42,
    targetDate: 'Q4 2026',
  },
  {
    id: 's-enshrouded',
    name: 'dahLRealm | Embervale',
    game: 'Enshrouded Dedicated',
    badge: 'Under Testing',
    description: 'Flameborn survival world with custom building preserves and group dungeon progression.',
    status: 'testing',
    votes: 28,
    targetDate: 'Late 2026',
  },
  {
    id: 's-ark',
    name: 'dahLRealm | ARK: Survival Ascended',
    game: 'ARK: SA (Island & Scorched)',
    badge: 'Community Request',
    description: 'Balanced 3x harvesting & taming rates with active admin moderation and weekend boss events.',
    status: 'planned',
    votes: 19,
    targetDate: '2027',
  },
];

function generateHistory() {
  const points = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    const hourLabel = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const hour = t.getHours();
    let base = 2;
    if (hour >= 17 && hour <= 23) base = 5;
    else if (hour >= 12 && hour <= 16) base = 3;
    else if (hour >= 2 && hour <= 7) base = 0;

    const count = Math.max(0, Math.min(valheimConfig.maxPlayers, base + Math.floor((Math.sin(i * 0.8) + 1))));
    points.push({
      time: hourLabel,
      players: count,
      ping: Math.floor(20 + Math.random() * 8),
      cpu: Math.floor(18 + count * 3.2 + Math.random() * 5),
    });
  }
  return points;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API: Server status endpoint
    if (url.pathname === '/api/servers') {
      const elapsedMinutes = Math.floor((Date.now() % (86400000 * 30)) / 60000);
      const day = 284 + Math.floor(elapsedMinutes / 30);
      const dayPhaseNumber = elapsedMinutes % 30;
      let timeOfDay = 'Day';
      if (dayPhaseNumber < 4) timeOfDay = 'Dawn';
      else if (dayPhaseNumber < 20) timeOfDay = 'Day';
      else if (dayPhaseNumber < 24) timeOfDay = 'Dusk';
      else timeOfDay = 'Night';

      const jitterPing = Math.floor(21 + Math.random() * 5);
      const jitterCpu = Math.floor(22 + currentPlayers.length * 3.4 + Math.random() * 3);
      const baseMemory = 3840;
      const jitterMemory = baseMemory + currentPlayers.length * 280 + Math.floor(Math.random() * 64);

      const responseData = {
        domain: 'dahLRealm',
        activeServersCount: 1,
        totalCapacity: valheimConfig.maxPlayers,
        activeVikingsOnline: currentPlayers.length,
        valheim: {
          config: valheimConfig,
          status: {
            online: true,
            isLiveA2S: false,
            lastChecked: new Date().toISOString(),
            ping: jitterPing,
            tickrate: 60.0,
            uptimeSeconds: 1238492,
            currentDay: day,
            timeOfDay,
            cpuUsage: jitterCpu,
            memoryUsageMb: jitterMemory,
            memoryTotalMb: 16384,
            players: currentPlayers,
            activePlayerCount: currentPlayers.length,
            bosses: bossList,
            recentEvents: [
              { id: 'ev-1', timestamp: '2 mins ago', type: 'join', message: 'Einar_Ironbreaker joined from edge', severity: 'info' },
              { id: 'ev-2', timestamp: '14 mins ago', type: 'save', message: 'World "Dahlgard" sync active', severity: 'success' },
            ],
            history: generateHistory(),
          },
        },
        plannedServers,
      };

      return new Response(JSON.stringify(responseData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    // API: Config update
    if (url.pathname === '/api/servers/valheim/update' && request.method === 'POST') {
      try {
        const updates = await request.json() as any;
        if (updates.name) valheimConfig.name = String(updates.name).slice(0, 80);
        if (updates.domain) valheimConfig.domain = String(updates.domain).slice(0, 100);
        if (updates.gamePort) valheimConfig.gamePort = Number(updates.gamePort);
        if (updates.queryPort) valheimConfig.queryPort = Number(updates.queryPort);
        if (updates.queryMode) valheimConfig.queryMode = updates.queryMode;
        return new Response(JSON.stringify({ success: true, config: valheimConfig }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
      }
    }

    // API: Query test diagnostic
    if (url.pathname === '/api/servers/valheim/query-test') {
      return new Response(JSON.stringify({
        success: false,
        durationMs: 0,
        error: 'Cloudflare Workers edge does not support outbound UDP sockets (A2S query requires UDP).',
        troubleshooting: [
          'The frontend and dashboard run perfectly on Cloudflare.',
          'For live UDP Steam queries to your Valheim server, run the included server.ts on a VPS or alongside your Valheim server.',
        ],
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default: Serve static assets (Vite React application)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
