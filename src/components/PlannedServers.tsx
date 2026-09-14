import React, { useState } from 'react';
import { 
  Sparkles, 
  ThumbsUp, 
  Clock, 
  Layers, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { PlannedServer } from '../types';

interface PlannedServersProps {
  servers: PlannedServer[];
  onVote: (serverId: string) => Promise<void>;
}

export const PlannedServers: React.FC<PlannedServersProps> = ({
  servers,
  onVote,
}) => {
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [votingId, setVotingId] = useState<string | null>(null);

  const handleVote = async (id: string) => {
    if (votedIds.has(id)) return;
    setVotingId(id);
    try {
      await onVote(id);
      setVotedIds(new Set([...votedIds, id]));
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 rounded-2xl bg-[#0d131f] border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Infrastructure Roadmap</span>
          </div>
          <h3 className="font-display font-bold text-slate-100 text-xl tracking-wide">
            Future dahLRealm Gaming Servers
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Right now, Valheim is our primary active dedicated realm. Help decide which dedicated server we spin up next!
          </p>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400">
          Community Voting Open
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {servers.map((server) => {
          const hasVoted = votedIds.has(server.id);
          const isCurrentVoting = votingId === server.id;

          return (
            <div
              key={server.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {server.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {server.targetDate || 'TBD'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-200 text-sm">{server.name}</h4>
                <p className="text-xs font-medium text-amber-400/80 mt-0.5">{server.game}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {server.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  <strong className="text-amber-400">{server.votes}</strong> supporters
                </span>

                <button
                  onClick={() => handleVote(server.id)}
                  disabled={hasVoted || isCurrentVoting}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    hasVoted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {hasVoted ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Voted</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className={`w-3 h-3 ${isCurrentVoting ? 'animate-bounce' : ''}`} />
                      <span>Vote Next</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
