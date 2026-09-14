import React from 'react';
import { 
  Users, 
  Clock, 
  Wifi, 
  MapPin, 
  Crown, 
  ShieldAlert, 
  UserCheck,
  X
} from 'lucide-react';
import { Player } from '../types';

interface PlayerRosterProps {
  players: Player[];
  maxPlayers: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerRoster: React.FC<PlayerRosterProps> = ({
  players,
  maxPlayers,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getBiomeBadge = (biome: Player['biome']) => {
    switch (biome) {
      case 'Meadows':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
      case 'Black Forest':
        return 'bg-teal-950/60 text-teal-300 border-teal-800/80';
      case 'Swamp':
        return 'bg-lime-950/60 text-lime-400 border-lime-800/80';
      case 'Mountains':
        return 'bg-sky-950/60 text-sky-300 border-sky-800/80';
      case 'Plains':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/80';
      case 'Mistlands':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/80';
      case 'Ashlands':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formatPlaytime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0) return `${hours}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1724] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Active Vikings in dahLRealm
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {players.length} of {maxPlayers} exploring Midgard
              </p>
            </div>
          </div>
          <button
            id="close-player-roster-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Players List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {players.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="font-display font-medium text-slate-300">The Mead Hall is Quiet</p>
              <p className="text-xs text-slate-500 mt-1">No warriors are currently logged in to dahLRealm.</p>
            </div>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-300 font-bold text-sm">
                    {player.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{player.name}</span>
                      {player.role === 'Jarl' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Crown className="w-3 h-3 text-amber-400" />
                          Jarl
                        </span>
                      )}
                      {player.role === 'Admin' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-300 border border-red-500/30">
                          <ShieldAlert className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Online: {formatPlaytime(player.connectedMinutes)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Wifi className="w-3 h-3 text-emerald-400" />
                        {player.ping}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location / Biome Badge */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getBiomeBadge(player.biome)}`}>
                    <MapPin className="w-3 h-3" />
                    <span>{player.biome}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="font-mono text-[11px]">
            Server ticks: 60/s • Anti-cheat active
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};
