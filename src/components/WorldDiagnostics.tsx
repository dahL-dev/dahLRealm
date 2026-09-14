import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Clock, 
  Activity, 
  Skull, 
  CheckCircle2, 
  CircleDashed,
  TrendingUp,
  Zap,
  Server
} from 'lucide-react';
import { BossProgress, ServerHistoryPoint, ValheimServerStatus } from '../types';

interface WorldDiagnosticsProps {
  status: ValheimServerStatus;
}

export const WorldDiagnostics: React.FC<WorldDiagnosticsProps> = ({ status }) => {
  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const memoryGb = (status.memoryUsageMb / 1024).toFixed(2);
  const totalMemoryGb = (status.memoryTotalMb / 1024).toFixed(0);
  const memPercent = Math.round((status.memoryUsageMb / status.memoryTotalMb) * 100);

  // SVG Chart calculation for 24h history
  const history = status.history || [];
  const maxPlayersInHistory = Math.max(6, ...history.map((h) => h.players));
  const chartHeight = 80;
  const chartWidth = 500;

  return (
    <div className="space-y-6">
      
      {/* 4 Performance Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CPU Usage */}
        <div className="p-4 rounded-xl bg-[#0d131f] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">CPU Engine Load</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">{status.cpuUsage}%</span>
              <span className="text-xs font-mono text-emerald-400">Stable</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, status.cpuUsage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Memory Load */}
        <div className="p-4 rounded-xl bg-[#0d131f] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">RAM Allocation</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">{memoryGb}</span>
              <span className="text-xs font-mono text-slate-400">/ {totalMemoryGb} GB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${memPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Server Uptime */}
        <div className="p-4 rounded-xl bg-[#0d131f] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Uptime Continuous</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-100">{formatUptime(status.uptimeSeconds)}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">99.98% availability SLA</p>
          </div>
        </div>

        {/* Tickrate & Port Network */}
        <div className="p-4 rounded-xl bg-[#0d131f] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Network Sockets</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Tickrate:</span>
              <span className="text-emerald-400 font-bold">{status.tickrate.toFixed(1)} Hz</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono mt-1 pt-1 border-t border-slate-800">
              <span className="text-slate-400">Query Port:</span>
              <span className="text-slate-200">2457 (A2S)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2-Column: 24h Activity Trend & World Bosses Trophy Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 24h Player Activity History Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d131f] border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide">
                24-Hour Realm Population Trend
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Peak: {Math.max(...history.map(h => h.players), 0)} Vikings
            </span>
          </div>

          {/* SVG Sparkline / Bar Chart */}
          <div className="pt-2">
            <div className="h-32 flex items-end gap-1.5 sm:gap-2 px-1 border-b border-slate-800">
              {history.map((point, index) => {
                const heightPercent = maxPlayersInHistory > 0 
                  ? Math.max(8, (point.players / maxPlayersInHistory) * 100) 
                  : 8;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="bg-slate-900 border border-slate-700 text-[10px] font-mono px-2 py-1 rounded shadow-lg text-slate-200 whitespace-nowrap">
                        {point.time}: <strong className="text-amber-400">{point.players}</strong> players ({point.ping}ms)
                      </div>
                      <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700"></div>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        point.players > 0
                          ? 'bg-amber-500/70 group-hover:bg-amber-400'
                          : 'bg-slate-800/80 group-hover:bg-slate-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Time labels below chart */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 px-1">
              <span>24h ago</span>
              <span>18h ago</span>
              <span>12h ago</span>
              <span>6h ago</span>
              <span className="text-amber-400">Now</span>
            </div>
          </div>
        </div>

        {/* Boss Progression Tracker */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d131f] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-rose-400" />
                <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide">
                  Realm Boss Defeat Altar
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {status.bosses.filter((b) => b.defeated).length} / {status.bosses.length} Vanquished
              </span>
            </div>

            <div className="space-y-2.5">
              {status.bosses.map((boss) => (
                <div
                  key={boss.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    boss.defeated
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-200'
                      : 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {boss.defeated ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <CircleDashed className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <span className={`font-semibold ${boss.defeated ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {boss.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Biome: {boss.biome}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    {boss.defeated ? (
                      <span className="text-emerald-400 font-medium">Slain ({boss.defeatedDate || 'Day 260'})</span>
                    ) : (
                      <span className="text-slate-500 italic">Undefeated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-mono mt-4 pt-2 border-t border-slate-800/80">
            Offerings accepted at the Sacrificial Stones altar.
          </p>
        </div>

      </div>

    </div>
  );
};
