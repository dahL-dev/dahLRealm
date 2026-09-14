import React, { useState } from 'react';
import { 
  Server, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  ShieldCheck, 
  Lock, 
  Globe2, 
  Sparkles, 
  Eye, 
  EyeOff,
  Compass,
  Cpu,
  Activity,
  ChevronRight
} from 'lucide-react';
import { ValheimServerConfig, ValheimServerStatus } from '../types';

interface ValheimHeroProps {
  config: ValheimServerConfig;
  status: ValheimServerStatus;
  onOpenPlayers: () => void;
  onOpenGuide: () => void;
  onOpenConfig: () => void;
  onOpenLiveSetup: () => void;
}

export const ValheimHero: React.FC<ValheimHeroProps> = ({
  config,
  status,
  onOpenPlayers,
  onOpenGuide,
  onOpenConfig,
  onOpenLiveSetup,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSeed, setShowSeed] = useState(false);

  const fullAddress = `${config.domain}:${config.gamePort}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getDayIcon = () => {
    switch (status.timeOfDay) {
      case 'Dawn':
        return <Sunrise className="w-4 h-4 text-amber-300" />;
      case 'Day':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Dusk':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'Night':
        return <Moon className="w-4 h-4 text-indigo-300" />;
    }
  };

  const playerPercentage = Math.min(100, Math.round((status.activePlayerCount / config.maxPlayers) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0d131f]/90 shadow-xl shadow-black/40">
      
      {/* Subtle Norse rune accent aura */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Ribbon */}
      <div className="border-b border-slate-800/80 px-6 py-3.5 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          {status.online ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              VALHEIM DEDICATED • ONLINE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              VALHEIM DEDICATED • OFFLINE / UNREACHABLE
            </span>
          )}

          <button
            onClick={onOpenLiveSetup}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium transition-colors border ${
              config.queryMode === 'live' && status.isLiveA2S
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <span>{config.queryMode === 'live' && status.isLiveA2S ? '⚡ Steam A2S Live' : '✨ Showcase Mode'}</span>
            <span className="text-slate-500 text-[10px] underline ml-0.5">Setup Guide</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Day / Night Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300 font-mono text-[11px]">
            {getDayIcon()}
            <span>Day {status.currentDay}</span>
            <span className="text-slate-500">({status.timeOfDay})</span>
          </div>

          {/* Crossplay Badge */}
          {config.crossplayEnabled && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Globe2 className="w-3 h-3 text-cyan-400" />
              Crossplay Enabled
            </span>
          )}
        </div>
      </div>

      {/* Warning banner if live query failed */}
      {config.queryMode === 'live' && !status.isLiveA2S && (
        <div 
          onClick={onOpenLiveSetup}
          className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200 cursor-pointer hover:bg-amber-500/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Live Steam query timed out on {config.domain}:{config.queryPort}.</span>
            <span className="text-amber-300/80 hidden sm:inline">Ensure your Valheim server is running with &quot;-public 1&quot; and port 2457 UDP is open.</span>
          </div>
          <span className="font-mono text-[11px] text-amber-400 underline underline-offset-2 shrink-0">
            Open Setup Guide →
          </span>
        </div>
      )}

      {/* Main Hero Body */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Server Identity & Connection Details */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Realm</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {config.name}
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                {config.tagline}
              </p>
            </div>

            {/* Direct Connect Address Box */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                  <Server className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-mono uppercase text-slate-400">Server Direct Connect Address</p>
                  <p className="font-mono text-sm sm:text-base font-semibold text-slate-100 truncate select-all">
                    {fullAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="copy-address-btn"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy IP</span>
                    </>
                  )}
                </button>

                <a
                  href={`steam://connect/${fullAddress}`}
                  title="Launch & Connect via Steam"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Connect Steam</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick helper notes */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password: <strong className="text-slate-200 font-medium">{config.passwordHint || 'Protected'}</strong></span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Location: <span className="text-slate-200">{config.location}</span></span>
              </span>
              <span className="text-slate-600">•</span>
              <button 
                onClick={onOpenGuide}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Connection Guide</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Player Count Gauge & World Stats Card */}
          <div className="lg:col-span-5 bg-slate-900/60 rounded-xl p-5 border border-slate-800 space-y-4">
            
            {/* Player Capacity Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-300">Viking Explorers</span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-lg font-bold text-white">{status.activePlayerCount}</span>
                  <span className="text-slate-500"> / {config.maxPlayers} online</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, playerPercentage)}%` }}
                />
              </div>

              {/* Online Player Avatars / Quick Roster Trigger */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {status.players.slice(0, 5).map((player, idx) => (
                    <div
                      key={player.id}
                      title={`${player.name} (${player.biome})`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 text-[10px] font-bold text-amber-300"
                    >
                      {player.name.slice(0, 2).toUpperCase()}
                    </div>
                  ))}
                  {status.players.length > 5 && (
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 text-[10px] font-bold text-slate-200">
                      +{status.players.length - 5}
                    </div>
                  )}
                </div>

                <button
                  id="view-viking-roster-btn"
                  onClick={onOpenPlayers}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>View Player Roster</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick World Metadata Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">World Name</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">{config.worldName}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-500">World Seed</span>
                  <button 
                    onClick={() => setShowSeed(!showSeed)}
                    className="text-slate-500 hover:text-slate-300"
                    title={showSeed ? 'Hide Seed' : 'Show Seed'}
                  >
                    {showSeed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <span className="font-mono text-xs text-amber-300 block mt-0.5 truncate">
                  {showSeed ? config.worldSeed : '••••••••••••'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Server Tickrate</span>
                <span className="font-mono font-semibold text-emerald-400 block mt-0.5">{status.tickrate.toFixed(1)} Hz</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Roundtrip Latency</span>
                <span className="font-mono font-semibold text-slate-200 block mt-0.5">{status.ping} ms</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
