import React from 'react';
import { 
  ScrollText, 
  Flame, 
  Save, 
  LogIn, 
  AlertTriangle, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { ServerEvent } from '../types';

interface EventFeedProps {
  events: ServerEvent[];
}

export const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  const getEventIcon = (type: ServerEvent['type']) => {
    switch (type) {
      case 'join':
        return <LogIn className="w-4 h-4 text-emerald-400" />;
      case 'save':
        return <Save className="w-4 h-4 text-cyan-400" />;
      case 'raid':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'boss':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0d131f] border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide">
            Odin&apos;s Chronicles • Live Realm Events
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Radio className="w-3 h-3 animate-pulse" />
          Live Log Stream
        </span>
      </div>

      <div className="space-y-2.5">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800/80 shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div>
                <p className="text-slate-200 font-medium leading-snug">
                  {event.message}
                </p>
                <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                  Event type: <span className="uppercase text-slate-400">{event.type}</span>
                </span>
              </div>
            </div>

            <span className="shrink-0 font-mono text-[11px] text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded">
              {event.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
