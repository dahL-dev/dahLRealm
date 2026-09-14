import React, { useState } from 'react';
import { 
  Terminal, 
  X, 
  Send, 
  Wifi, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  Globe
} from 'lucide-react';

interface PingTesterModalProps {
  defaultHost: string;
  defaultPort: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PingTesterModal: React.FC<PingTesterModalProps> = ({
  defaultHost,
  defaultPort,
  isOpen,
  onClose,
}) => {
  const [host, setHost] = useState(defaultHost);
  const [port, setPort] = useState(String(defaultPort));
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<{
    reachable: boolean;
    latency: number;
    resolvedIp?: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setResult(null);

    try {
      const res = await fetch('/api/servers/ping-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port: Number(port) }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        reachable: false,
        latency: 0,
        message: 'Could not communicate with ping probe service.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getLatencyQuality = (ms: number) => {
    if (ms < 35) return { label: 'Optimal (< 35ms)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (ms < 80) return { label: 'Good (< 80ms)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'High Latency', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1724] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Live Server Ping Probe
              </h2>
              <p className="text-xs text-slate-400">
                Measure DNS lookup & network latency to dahLRealm endpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleTest} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Target Hostname / IP
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isTesting}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Probing Socket...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Diagnostic Probe</span>
                </>
              )}
            </button>
          </form>

          {/* Results Box */}
          {result && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.reachable ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="font-semibold text-slate-200 text-xs">
                    {result.reachable ? 'Host Reachable & Responding' : 'Probe Failed'}
                  </span>
                </div>

                {result.latency > 0 && (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLatencyQuality(result.latency).color}`}>
                    {result.latency} ms
                  </span>
                )}
              </div>

              {result.resolvedIp && (
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800/80">
                  <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Resolved: <strong className="text-slate-200">{result.resolvedIp}</strong></span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
