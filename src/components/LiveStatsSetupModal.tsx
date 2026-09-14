import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Network, 
  HelpCircle,
  Activity,
  Play
} from 'lucide-react';
import { ValheimServerConfig } from '../types';

interface LiveStatsSetupModalProps {
  config: ValheimServerConfig;
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode: (mode: 'live' | 'showcase') => Promise<void>;
}

export const LiveStatsSetupModal: React.FC<LiveStatsSetupModalProps> = ({
  config,
  isOpen,
  onClose,
  onSwitchMode,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testHost, setTestHost] = useState(config.domain);
  const [testPort, setTestPort] = useState(String(config.queryPort));
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const startupScript = `./valheim_server.x86_64 \\
  -name "${config.name}" \\
  -port 2456 \\
  -world "${config.worldName}" \\
  -password "YourPassword" \\
  -public 1`;

  const firewallCommand = `sudo ufw allow 2456:2457/udp`;

  const runLiveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/servers/valheim/query-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: testHost, queryPort: Number(testPort) }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err?.message || 'Network error executing probe',
        troubleshooting: ['Check your internet connection and server status'],
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1724] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Live Statistics Setup Guide (Steam A2S)
              </h2>
              <p className="text-xs text-slate-400">
                Configure your Valheim Dedicated Server to feed 100% real-time stats to dahLRealm
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Query Mode Status Pill */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200 text-sm">Active Monitoring Mode:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                  config.queryMode === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {config.queryMode === 'live' ? '⚡ LIVE STEAM QUERY (A2S)' : '✨ SHOWCASE / DEMO MODE'}
                </span>
              </div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {config.queryMode === 'live' 
                  ? 'Queries your live server over UDP 2457. If the server is offline or unreachable, an alert will be displayed.'
                  : 'Displays continuous realistic day/night cycles and simulated statistics until your live server is online.'}
              </p>
            </div>

            <button
              onClick={() => onSwitchMode(config.queryMode === 'live' ? 'showcase' : 'live')}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                config.queryMode === 'live'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
              }`}
            >
              {config.queryMode === 'live' ? 'Switch to Showcase' : 'Activate Live Mode'}
            </button>
          </div>

          {/* Interactive Live Query Tester */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <Network className="w-4 h-4" />
              <span>Test Live Query Against Your Server</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Test whether Valve&apos;s Steam A2S protocol can reach your Valheim server right now:
            </p>

            <form onSubmit={runLiveTest} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  value={testHost}
                  onChange={(e) => setTestHost(e.target.value)}
                  placeholder="e.g. valheim.dahlrealm.com or Public IP"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  value={testPort}
                  onChange={(e) => setTestPort(e.target.value)}
                  placeholder="2457"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isTesting}
                  className="w-full h-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Probing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Query</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Test result output */}
            {testResult && (
              <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-2 mt-2 ${
                testResult.success 
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {testResult.success ? 'Server Responded to Steam Query!' : 'Query Failed / Timed Out'}
                  </span>
                  <span>{testResult.durationMs}ms</span>
                </div>

                {testResult.success && (
                  <div className="p-2 rounded bg-slate-950/80 border border-emerald-900/60 text-slate-200 space-y-1">
                    <div>Server Name: <strong className="text-amber-400">{testResult.data.name}</strong></div>
                    <div>World Map: <span className="text-cyan-300">{testResult.data.map}</span></div>
                    <div>Players: <strong className="text-emerald-400">{testResult.data.numplayers}</strong> / {testResult.data.maxplayers}</div>
                    <div>Ping: {testResult.data.ping}ms</div>
                  </div>
                )}

                {testResult.troubleshooting && (
                  <div className="text-slate-300 space-y-1 pt-1">
                    <span className="font-semibold text-rose-400 block">Troubleshooting steps:</span>
                    {testResult.troubleshooting.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3 Clear Setup Requirements */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-200 uppercase tracking-wider">
              3 Required Steps for 100% Real Live Statistics
            </h3>

            {/* Step 1: Startup script */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center">1</span>
                  <span>Valheim Startup Parameter: &quot;-public 1&quot;</span>
                </span>
                <button
                  onClick={() => copyText(startupScript, 'script')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Valheim dedicated servers require <strong className="text-slate-300">-public 1</strong> in their startup command so Valve&apos;s Steam Master Server and A2S queries can query your server details.
              </p>
              <pre className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-slate-300 select-all overflow-x-auto">
                {startupScript}
              </pre>
            </div>

            {/* Step 2: Port Forwarding (Game + Query Port) */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center">2</span>
                  <span>Forward UDP Ports: 2456 AND 2457</span>
                </span>
                <button
                  onClick={() => copyText(firewallCommand, 'ufw')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'ufw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ufw' ? 'Copied' : 'Copy UFW'}</span>
                </button>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Valheim uses <strong>two consecutive UDP ports</strong>: Game Port (<strong className="text-slate-200">2456 UDP</strong>) and Query Port (<strong className="text-slate-200">2457 UDP</strong>). Both must be forwarded in your router and allowed through your OS firewall!
              </p>
              <pre className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-slate-300 select-all overflow-x-auto">
                {firewallCommand}
              </pre>
            </div>

            {/* Step 3: Cloudflare / DNS Notice */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center">3</span>
                <span>DNS Record: &quot;DNS Only&quot; (Grey Cloud)</span>
              </span>
              <p className="text-slate-400 leading-relaxed">
                If your domain <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">valheim.dahlrealm.com</code> uses Cloudflare DNS, make sure the proxy status is set to <strong className="text-slate-200">DNS Only (Grey Cloud)</strong>. Cloudflare&apos;s standard CDN proxy (Orange Cloud) only passes HTTP/HTTPS web traffic and blocks gaming UDP packets.
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">
            Powered by GameDig & Steam A2S Query
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
