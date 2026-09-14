import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Sliders, 
  Users, 
  Skull, 
  Bell, 
  Zap, 
  Check, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Shield, 
  Clock, 
  Cpu, 
  HardDrive, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Sparkles, 
  Save, 
  ShieldAlert, 
  Crown,
  Activity,
  UserPlus,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { ValheimServerConfig, ValheimServerStatus, Player, BossProgress } from '../types';
import { useAuth } from '../context/AuthContext';

interface AdminStatsControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ValheimServerConfig;
  status: ValheimServerStatus;
  onRefresh: () => void;
}

type TabType = 'telemetry' | 'players' | 'bosses' | 'events' | 'presets';

export const AdminStatsControlModal: React.FC<AdminStatsControlModalProps> = ({
  isOpen,
  onClose,
  config,
  status,
  onRefresh,
}) => {
  const { isAdmin, currentUser, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('telemetry');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [presetNotice, setPresetNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isOnline, setIsOnline] = useState(true);
  const [ping, setPing] = useState(24);
  const [tickrate, setTickrate] = useState(60);
  const [currentDay, setCurrentDay] = useState(284);
  const [timeOfDay, setTimeOfDay] = useState<'Dawn' | 'Day' | 'Dusk' | 'Night'>('Day');
  const [cpuUsage, setCpuUsage] = useState(28);
  const [memoryUsageMb, setMemoryUsageMb] = useState(4120);
  const [memoryTotalMb, setMemoryTotalMb] = useState(16384);
  const [uptimeDays, setUptimeDays] = useState(14);
  const [queryErrorNote, setQueryErrorNote] = useState('');

  // Players state
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<'Viking' | 'Jarl' | 'Admin'>('Viking');
  const [newPlayerBiome, setNewPlayerBiome] = useState<Player['biome']>('Meadows');
  const [newPlayerPing, setNewPlayerPing] = useState(25);

  // Bosses state
  const [bossesList, setBossesList] = useState<BossProgress[]>([]);

  // Broadcast event state
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'join' | 'leave' | 'save' | 'raid' | 'boss' | 'system'>('system');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'info' | 'success' | 'warning' | 'alert'>('info');

  // Load exact saved manual stats from backend on open (or on explicit reset)
  const loadSavedStats = useCallback(async () => {
    setIsLoadingSaved(true);
    setError(null);
    try {
      const res = await fetch('/api/servers/valheim/manual-stats');
      if (res.ok) {
        const data = await res.json();
        if (data.manualStats) {
          setIsOnline(data.manualStats.online ?? true);
          setPing(data.manualStats.ping ?? 24);
          setTickrate(data.manualStats.tickrate ?? 60);
          setCurrentDay(data.manualStats.currentDay ?? 284);
          setTimeOfDay(data.manualStats.timeOfDay ?? 'Day');
          setCpuUsage(data.manualStats.cpuUsage ?? 28);
          setMemoryUsageMb(data.manualStats.memoryUsageMb ?? 4120);
          if (data.manualStats.memoryTotalMb) {
            setMemoryTotalMb(data.manualStats.memoryTotalMb);
          }
          setUptimeDays(Math.floor((data.manualStats.uptimeSeconds || 1238492) / 86400));
          setQueryErrorNote(data.manualStats.queryError || '');
        }
        if (Array.isArray(data.manualPlayers)) {
          setPlayersList(data.manualPlayers);
        }
        if (Array.isArray(data.manualBosses)) {
          setBossesList(data.manualBosses);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load saved manual stats from server, using fallback:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  // Sync state ONLY ONCE when modal transitions to open - completely decoupled from background status polling
  useEffect(() => {
    if (isOpen) {
      setSaveSuccess(false);
      setPresetNotice(null);
      setError(null);
      loadSavedStats();
    }
  }, [isOpen, loadSavedStats]);

  if (!isOpen) return null;

  // Access Control Guard
  if (!isAdmin) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-[#0f1724] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 text-slate-100 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Admin Control Menu Restricted
              </h3>
              <p className="text-xs text-slate-400">
                Live statistics manual override is restricted to administrator goddahL.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 mb-5">
            {currentUser ? (
              <>Signed in as <strong>{currentUser.username}</strong> ({currentUser.role}). Please sign in with administrator credentials.</>
            ) : (
              <>Please sign in as goddahL to access the manual statistics override menu.</>
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Sign In as Admin</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Save
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setError(null);
    setPresetNotice(null);

    try {
      const payload = {
        online: isOnline,
        ping: Number(ping),
        tickrate: Number(tickrate),
        uptimeSeconds: Number(uptimeDays) * 86400,
        currentDay: Number(currentDay),
        timeOfDay,
        cpuUsage: Number(cpuUsage),
        memoryUsageMb: Number(memoryUsageMb),
        memoryTotalMb,
        players: playersList,
        bosses: bossesList,
        queryError: isOnline ? '' : (queryErrorNote || 'Server offline for scheduled maintenance'),
        setQueryModeToManual: true,
      };

      const res = await fetch('/api/servers/valheim/manual-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update manual stats on the server');
      }

      const data = await res.json();
      if (data.manualStats) {
        setIsOnline(data.manualStats.online);
        setPing(data.manualStats.ping);
        setTickrate(data.manualStats.tickrate);
        setCurrentDay(data.manualStats.currentDay);
        setTimeOfDay(data.manualStats.timeOfDay);
        setCpuUsage(data.manualStats.cpuUsage);
        setMemoryUsageMb(data.manualStats.memoryUsageMb);
      }
      if (Array.isArray(data.manualPlayers)) {
        setPlayersList(data.manualPlayers);
      }
      if (Array.isArray(data.manualBosses)) {
        setBossesList(data.manualBosses);
      }

      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setError(err?.message || 'Error saving live stats overrides');
    } finally {
      setIsSaving(false);
    }
  };

  // Add player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: `man-p-${Date.now()}`,
      name: newPlayerName.trim(),
      role: newPlayerRole,
      biome: newPlayerBiome,
      ping: Number(newPlayerPing) || 24,
      connectedMinutes: 12,
    };

    setPlayersList([...playersList, newPlayer]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    setPlayersList(playersList.filter(p => p.id !== id));
  };

  // Toggle Boss
  const handleToggleBoss = (id: string) => {
    setBossesList(bossesList.map(b => {
      if (b.id === id) {
        const nextDefeated = !b.defeated;
        return {
          ...b,
          defeated: nextDefeated,
          defeatedDate: nextDefeated ? (b.defeatedDate || `Day ${currentDay}`) : undefined,
        };
      }
      return b;
    }));
  };

  // Dispatch live event
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    try {
      await fetch('/api/servers/valheim/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: broadcastMsg.trim(),
          type: broadcastType,
          severity: broadcastSeverity,
        }),
      });
      setBroadcastMsg('');
      onRefresh();
    } catch {
      // ignore
    }
  };

  // Apply Presets
  const applyPreset = (type: 'peak' | 'raid' | 'fresh' | 'maintenance') => {
    if (type === 'peak') {
      setIsOnline(true);
      setPing(21);
      setTickrate(60);
      setCurrentDay(285);
      setTimeOfDay('Day');
      setCpuUsage(46);
      setMemoryUsageMb(5200);
      setPlayersList([
        { id: 'p1', name: 'goddahL', role: 'Admin', biome: 'Mistlands', ping: 18, connectedMinutes: 145 },
        { id: 'p2', name: 'Skjaldborg', role: 'Jarl', biome: 'Ashlands', ping: 22, connectedMinutes: 98 },
        { id: 'p3', name: 'Astrid_Shield', role: 'Viking', biome: 'Plains', ping: 31, connectedMinutes: 65 },
        { id: 'p4', name: 'Einar_Ironbreaker', role: 'Viking', biome: 'Black Forest', ping: 25, connectedMinutes: 42 },
        { id: 'p5', name: 'Valkyrie_Rose', role: 'Viking', biome: 'Mistlands', ping: 29, connectedMinutes: 30 },
      ]);
      setPresetNotice('Loaded "Peak Prime Time" preset. Click "Save & Publish" to push to live server.');
    } else if (type === 'raid') {
      setIsOnline(true);
      setPing(28);
      setCurrentDay(284);
      setTimeOfDay('Night');
      setCpuUsage(54);
      setMemoryUsageMb(5600);
      setBroadcastMsg('A cold wind blows from the mountains! Raid repelled at Fort Dahlgard');
      setBroadcastType('raid');
      setBroadcastSeverity('warning');
      setPresetNotice('Loaded "Raid in Progress" preset. Click "Save & Publish" to push to live server.');
    } else if (type === 'fresh') {
      setIsOnline(true);
      setCurrentDay(1);
      setTimeOfDay('Dawn');
      setPing(19);
      setCpuUsage(18);
      setMemoryUsageMb(3200);
      setPlayersList([
        { id: 'p1', name: 'goddahL', role: 'Admin', biome: 'Meadows', ping: 18, connectedMinutes: 15 },
      ]);
      setBossesList(bossesList.map(b => ({ ...b, defeated: false, defeatedDate: undefined })));
      setPresetNotice('Loaded "Fresh World Dawn" preset. Click "Save & Publish" to push to live server.');
    } else if (type === 'maintenance') {
      setIsOnline(false);
      setQueryErrorNote('Scheduled realm maintenance & world backup in progress. Returning shortly.');
      setPlayersList([]);
      setPresetNotice('Loaded "Scheduled Maintenance" preset. Click "Save & Publish" to push to live server.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b1320] border border-amber-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-white tracking-wide">
                  Admin Live Stats Control Menu
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  goddahL Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Override & manually tune all live server stats, player lists, and world telemetry in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSavedStats}
              disabled={isLoadingSaved || isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Discard unsaved edits and reload current saved settings from server"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoadingSaved ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isLoadingSaved ? 'Loading...' : 'Reload Saved'}</span>
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Applying...' : 'Save & Publish'}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Notice Banner */}
        {presetNotice && (
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{presetNotice}</span>
            </div>
            <button 
              onClick={() => setPresetNotice(null)}
              className="text-amber-400 hover:text-white text-[11px] font-mono underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Current Active Mode Bar */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">ACTIVE MONITORING MODE:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
              config.queryMode === 'manual'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : config.queryMode === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              {config.queryMode === 'manual' ? '🛠️ MANUAL OVERRIDE (ACTIVE)' : config.queryMode === 'live' ? '⚡ LIVE STEAM A2S QUERY' : '✨ SHOWCASE DEMO'}
            </span>
          </div>

          {config.queryMode !== 'manual' && (
            <button
              onClick={async () => {
                await fetch('/api/servers/valheim/update', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ queryMode: 'manual' }),
                });
                onRefresh();
              }}
              className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Activate Manual Override Mode
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900/40 overflow-x-auto">
          {[
            { id: 'telemetry', label: 'Core Telemetry', icon: Sliders },
            { id: 'players', label: `Vikings Online (${playersList.length})`, icon: Users },
            { id: 'bosses', label: `Bosses (${bossesList.filter(b => b.defeated).length}/${bossesList.length})`, icon: Skull },
            { id: 'events', label: 'Broadcast Events', icon: Bell },
            { id: 'presets', label: 'Quick Presets', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-amber-500 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: CORE TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              {/* Online / Offline Switch */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Server Power & Reachability</span>
                  <span className="text-slate-400 text-xs">
                    Controls whether the server appears as &quot;Online&quot; or &quot;Offline&quot; on the public status dashboard.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                    isOnline 
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm'
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-slate-950 animate-ping' : 'bg-white'}`} />
                  <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                </button>
              </div>

              {!isOnline && (
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                  <label className="block font-medium text-rose-300 uppercase font-mono text-[10px]">
                    Offline Notice / Maintenance Reason
                  </label>
                  <input
                    type="text"
                    value={queryErrorNote}
                    onChange={(e) => setQueryErrorNote(e.target.value)}
                    placeholder="e.g. Scheduled server update in progress. Back online at 18:00 UTC."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-rose-800/50 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              {/* Ping & Tickrate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ping / Latency</span>
                    </label>
                    <span className="font-mono font-bold text-cyan-300">{ping} ms</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    value={ping}
                    onChange={(e) => setPing(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>5ms (Fiber)</span>
                    <span>50ms</span>
                    <span>200ms</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tickrate (Hz)</span>
                    </label>
                    <span className="font-mono font-bold text-amber-300">{tickrate} Hz</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="144"
                    value={tickrate}
                    onChange={(e) => setTickrate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500">Valheim dedicated servers default to 30.0 or 60.0 Hz.</p>
                </div>
              </div>

              {/* In-Game Day & Time of Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>In-Game World Day</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentDay}
                    onChange={(e) => setCurrentDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500">Current day counter in the Valheim realm.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="font-semibold text-slate-300">Time of Day</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'Dawn', icon: Sunrise, label: 'Dawn' },
                      { id: 'Day', icon: Sun, label: 'Day' },
                      { id: 'Dusk', icon: Sunset, label: 'Dusk' },
                      { id: 'Night', icon: Moon, label: 'Night' },
                    ].map((phase) => {
                      const Icon = phase.icon;
                      const isSel = timeOfDay === phase.id;
                      return (
                        <button
                          key={phase.id}
                          type="button"
                          onClick={() => setTimeOfDay(phase.id as any)}
                          className={`p-2 rounded-lg border text-center transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{phase.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hardware Performance Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>CPU Load</span>
                    </label>
                    <span className="font-mono font-bold text-purple-300">{cpuUsage}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={cpuUsage}
                    onChange={(e) => setCpuUsage(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      <span>RAM Allocation</span>
                    </label>
                    <span className="font-mono font-bold text-blue-300">
                      {(memoryUsageMb / 1024).toFixed(1)} GB / {(memoryTotalMb / 1024).toFixed(0)} GB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max={memoryTotalMb}
                    step="256"
                    value={memoryUsageMb}
                    onChange={(e) => setMemoryUsageMb(Number(e.target.value))}
                    className="w-full accent-blue-400"
                  />
                </div>
              </div>

              {/* Server Uptime */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Server Uptime Counter</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Total days without a reboot</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={uptimeDays}
                    onChange={(e) => setUptimeDays(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-400 font-mono">Days</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE PLAYERS (VIKINGS) */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              {/* Add player form */}
              <form onSubmit={handleAddPlayer} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="font-semibold text-slate-200 block text-xs flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Add a Viking to the Active Roster</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Character Name (e.g. Ragnar)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={newPlayerRole}
                      onChange={(e) => setNewPlayerRole(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Viking">Viking</option>
                      <option value="Jarl">Jarl</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newPlayerBiome}
                      onChange={(e) => setNewPlayerBiome(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Meadows">Meadows</option>
                      <option value="Black Forest">Black Forest</option>
                      <option value="Swamp">Swamp</option>
                      <option value="Mountains">Mountains</option>
                      <option value="Plains">Plains</option>
                      <option value="Mistlands">Mistlands</option>
                      <option value="Ashlands">Ashlands</option>
                      <option value="Ocean">Ocean</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      value={newPlayerPing}
                      onChange={(e) => setNewPlayerPing(Number(e.target.value))}
                      placeholder="Ping"
                      className="w-full px-2 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs text-center font-mono focus:outline-none focus:border-emerald-500"
                      title="Ping in ms"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Player</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Roster list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Current Active Players ({playersList.length} / {config.maxPlayers})</span>
                  {playersList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPlayersList([])}
                      className="text-rose-400 hover:text-rose-300 text-[11px] cursor-pointer"
                    >
                      Clear All Players
                    </button>
                  )}
                </div>

                {playersList.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-slate-500">
                    No players currently marked online. Add players above or use a preset.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {playersList.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            player.role === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            player.role === 'Jarl' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs truncate">{player.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{player.role}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {player.biome} • {player.ping}ms • {player.connectedMinutes}m
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(player.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title="Remove player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BOSS PROGRESSION */}
          {activeTab === 'bosses' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Toggle the defeated state of each mythical Valheim forsaken boss. Defeated bosses will show on the dashboard with their trophy blessing altar.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {bossesList.map((boss) => (
                  <div
                    key={boss.id}
                    onClick={() => handleToggleBoss(boss.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      boss.defeated
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        boss.defeated ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                      }`}>
                        <Skull className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`font-bold block text-xs ${boss.defeated ? 'text-white' : 'text-slate-400'}`}>
                          {boss.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {boss.biome} • Trophy: {boss.trophy}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        boss.defeated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {boss.defeated ? (boss.defeatedDate || 'DEFEATED') : 'UNDFEATED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <form onSubmit={handleSendBroadcast} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="font-semibold text-slate-200 block text-xs flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>Broadcast an Event or Alert to the Community Feed</span>
                </span>
                
                <div>
                  <input
                    type="text"
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="e.g. World Boss Moder raid summoned by Clan Ironbreaker"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Event Type</label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                    >
                      <option value="system">System Notice</option>
                      <option value="raid">Raid Alert</option>
                      <option value="boss">Boss Altar</option>
                      <option value="save">World Save</option>
                      <option value="join">Player Join</option>
                      <option value="leave">Player Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Severity</label>
                    <select
                      value={broadcastSeverity}
                      onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Emerald)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="alert">Alert (Rose)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Broadcast Event
                    </button>
                  </div>
                </div>
              </form>

              {/* Recent events display */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Recent Feed Events</span>
                <div className="space-y-1.5">
                  {status.recentEvents?.slice(0, 5).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                          ev.severity === 'alert' ? 'bg-rose-500/20 text-rose-300' :
                          ev.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                          ev.severity === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {ev.type}
                        </span>
                        <span className="text-slate-200">{ev.message}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{ev.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INSTANT PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Quick 1-click scenario presets to populate the realm with realistic data while you configure your dedicated host:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => applyPreset('peak')}
                  className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                      🔥 Active Evening Peak
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">5 Vikings</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Populates 5 active Vikings including goddahL in the Mistlands, low 21ms ping, Day phase, and 46% CPU load.
                  </p>
                </div>

                <div 
                  onClick={() => applyPreset('raid')}
                  className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                      ⚔️ Mountain Cold Wind Raid
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Night Event</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Sets Night cycle, mountain raid announcement, elevated server load, and active defense roster.
                  </p>
                </div>

                <div 
                  onClick={() => applyPreset('fresh')}
                  className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                      🌱 Fresh World Dawn
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Day 1</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Resets to Day 1 at Dawn in the Meadows with zero defeated bosses and clean server load.
                  </p>
                </div>

                <div 
                  onClick={() => applyPreset('maintenance')}
                  className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs group-hover:text-rose-300 transition-colors">
                      🛑 Scheduled Maintenance
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">Offline</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Marks the realm offline with a custom scheduled maintenance message for players.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Changes save directly to server memory and reflect immediately across all connected clients.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Published Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
