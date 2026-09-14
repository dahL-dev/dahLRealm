/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Terminal, 
  Wifi, 
  Server, 
  Users, 
  Check, 
  Copy, 
  ExternalLink,
  BookOpen,
  Activity,
  Flame,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { Header } from './components/Header';
import { ValheimHero } from './components/ValheimHero';
import { PlayerRoster } from './components/PlayerRoster';
import { WorldDiagnostics } from './components/WorldDiagnostics';
import { EventFeed } from './components/EventFeed';
import { ConnectionGuide } from './components/ConnectionGuide';
import { ServerConfigModal } from './components/ServerConfigModal';
import { PingTesterModal } from './components/PingTesterModal';
import { PlannedServers } from './components/PlannedServers';
import { LiveStatsSetupModal } from './components/LiveStatsSetupModal';
import { AdminStatsControlModal } from './components/AdminStatsControlModal';
import { AuthModal } from './components/AuthModal';
import { ValheimServerConfig, ValheimServerStatus, PlannedServer } from './types';

// Fallback initial data in case of immediate render before API responds
const fallbackConfig: ValheimServerConfig = {
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
  queryMode: 'manual',
};

const fallbackStatus: ValheimServerStatus = {
  online: true,
  isLiveA2S: false,
  lastChecked: new Date().toISOString(),
  ping: 23,
  tickrate: 60.0,
  uptimeSeconds: 1238400,
  currentDay: 284,
  timeOfDay: 'Day',
  cpuUsage: 26,
  memoryUsageMb: 4120,
  memoryTotalMb: 16384,
  players: [
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
  ],
  activePlayerCount: 3,
  bosses: [
    { id: 'b1', name: 'Eikthyr', biome: 'Meadows', defeated: true, defeatedDate: 'Day 12', trophy: 'Antler Crown' },
    { id: 'b2', name: 'The Elder', biome: 'Black Forest', defeated: true, defeatedDate: 'Day 48', trophy: 'Swamp Key' },
    { id: 'b3', name: 'Bonemass', biome: 'Swamp', defeated: true, defeatedDate: 'Day 104', trophy: 'Wishbone' },
    { id: 'b4', name: 'Moder', biome: 'Mountains', defeated: true, defeatedDate: 'Day 182', trophy: 'Dragon Tear' },
    { id: 'b5', name: 'Yagluth', biome: 'Plains', defeated: true, defeatedDate: 'Day 260', trophy: 'Torn Spirit' },
    { id: 'b6', name: 'The Queen', biome: 'Mistlands', defeated: false, trophy: 'Majestic Carapace' },
    { id: 'b7', name: 'Fader', biome: 'Ashlands', defeated: false, trophy: 'Bell Fragment' },
  ],
  recentEvents: [
    { id: 'ev-1', timestamp: '2 mins ago', type: 'join', message: 'Einar_Ironbreaker woke up by the hearth fire', severity: 'info' },
    { id: 'ev-2', timestamp: '14 mins ago', type: 'save', message: 'World "Dahlgard" auto-save completed (18.4 MB)', severity: 'success' },
    { id: 'ev-3', timestamp: '38 mins ago', type: 'raid', message: 'Raid repelled: "A cold wind blows from the mountains"', severity: 'warning' },
    { id: 'ev-4', timestamp: '1 hr ago', type: 'boss', message: 'Trophy altar blessed with Yagluth offering', severity: 'success' },
    { id: 'ev-5', timestamp: '2 hrs ago', type: 'system', message: 'Daily scheduled memory cleanup & health check passed', severity: 'info' },
  ],
  history: [],
};

export default function App() {
  const [config, setConfig] = useState<ValheimServerConfig>(fallbackConfig);
  const [status, setStatus] = useState<ValheimServerStatus>(fallbackStatus);
  const [plannedServers, setPlannedServers] = useState<PlannedServer[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number>(15000); // 15s default
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'guide' | 'roadmap'>('overview');

  // Modals
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isPingProbeOpen, setIsPingProbeOpen] = useState(false);
  const [isLiveSetupModalOpen, setIsLiveSetupModalOpen] = useState(false);
  const [isAdminStatsOpen, setIsAdminStatsOpen] = useState(false);

  // Fetch servers data from server API
  const fetchServerStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/servers');
      if (res.ok) {
        const data = await res.json();
        if (data.valheim) {
          setConfig(data.valheim.config);
          setStatus(data.valheim.status);
        }
        if (data.plannedServers) {
          setPlannedServers(data.plannedServers);
        }
      }
    } catch (err) {
      console.warn('Using client-side cached data (API probe reconnecting):', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, []);

  // Polling effect - paused while Admin is actively editing live stats to avoid race conditions
  useEffect(() => {
    if (!isAdminStatsOpen) {
      fetchServerStats();
    }
    if (refreshInterval <= 0 || isAdminStatsOpen) return;

    const interval = setInterval(fetchServerStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchServerStats, refreshInterval, isAdminStatsOpen]);

  // Handle Server Configuration Save
  const handleSaveConfig = async (updated: Partial<ValheimServerConfig>) => {
    const res = await fetch('/api/servers/valheim/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Update failed');
    const data = await res.json();
    if (data.config) {
      setConfig(data.config);
    }
    // Refresh stats
    fetchServerStats();
  };

  // Handle Community Vote on Planned Server
  const handleVotePlannedServer = async (serverId: string) => {
    const res = await fetch('/api/servers/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId }),
    });
    if (res.ok) {
      const data = await res.json();
      setPlannedServers((prev) =>
        prev.map((s) => (s.id === serverId ? { ...s, votes: data.votes } : s))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Navigation & Realm Status Bar */}
      <Header
        online={status.online}
        ping={status.ping}
        activeVikings={status.activePlayerCount}
        maxPlayers={config.maxPlayers}
        isRefreshing={isRefreshing}
        refreshInterval={refreshInterval}
        onSetRefreshInterval={setRefreshInterval}
        onRefresh={fetchServerStats}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenDiagnostics={() => setIsPingProbeOpen(true)}
        onOpenLiveSetup={() => setIsLiveSetupModalOpen(true)}
        onOpenAdminStats={() => setIsAdminStatsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Domain Introduction Notice Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              Welcome to <strong className="text-slate-200 font-mono">dahLRealm</strong>. Featuring live real-time telemetry and connection monitoring for our hosted game servers.
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">
              Host Domain: <span className="text-amber-300 font-semibold">{config.domain}</span>
            </span>
          </div>
        </div>

        {/* Primary Hero: Active Valheim Dedicated Server */}
        <section aria-label="Valheim Dedicated Server Live Showcase">
          <ValheimHero
            config={config}
            status={status}
            onOpenPlayers={() => setIsRosterOpen(true)}
            onOpenGuide={() => {
              setActiveTab('guide');
              const el = document.getElementById('connection-guide-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenLiveSetup={() => setIsLiveSetupModalOpen(true)}
            onOpenAdminStats={() => setIsAdminStatsOpen(true)}
          />
        </section>

        {/* World Telemetry, Hardware & Boss Altar */}
        <section aria-label="Server Diagnostics and World Statistics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display text-lg font-bold text-slate-200 tracking-wide">
                Live Realm Performance & World Progress
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Polling every {refreshInterval > 0 ? `${refreshInterval / 1000}s` : 'manual'}
            </span>
          </div>

          <WorldDiagnostics status={status} />
        </section>

        {/* Live Realm Chronicles / Event Feed */}
        <section aria-label="Live Realm Events and Logs">
          <EventFeed events={status.recentEvents} />
        </section>

        {/* How to Connect Guide */}
        <section id="connection-guide-section" aria-label="Connection Handbook">
          <ConnectionGuide config={config} />
        </section>

        {/* Planned Servers / Roadmap for dahLRealm */}
        {plannedServers.length > 0 && (
          <section aria-label="Future Server Infrastructure">
            <PlannedServers
              servers={plannedServers}
              onVote={handleVotePlannedServer}
            />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b10] py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500/70" />
            <span className="font-display font-bold text-slate-300 tracking-wider">
              dahL<span className="text-amber-400">Realm</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Dedicated Gaming Infrastructure</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <span>Server: Valheim Dedicated</span>
            <span className="text-slate-700">•</span>
            <span>Domain: {config.domain}</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400">System Healthy</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PlayerRoster
        players={status.players}
        maxPlayers={config.maxPlayers}
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
      />

      <ServerConfigModal
        config={config}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
      />

      <PingTesterModal
        defaultHost={config.domain}
        defaultPort={config.gamePort}
        isOpen={isPingProbeOpen}
        onClose={() => setIsPingProbeOpen(false)}
      />

      <AuthModal />

      <LiveStatsSetupModal
        config={config}
        isOpen={isLiveSetupModalOpen}
        onClose={() => setIsLiveSetupModalOpen(false)}
        onSwitchMode={async (mode) => {
          await handleSaveConfig({ queryMode: mode });
        }}
        onOpenAdminStats={() => setIsAdminStatsOpen(true)}
      />

      <AdminStatsControlModal
        isOpen={isAdminStatsOpen}
        onClose={() => setIsAdminStatsOpen(false)}
        config={config}
        status={status}
        onRefresh={fetchServerStats}
      />

    </div>
  );
}
