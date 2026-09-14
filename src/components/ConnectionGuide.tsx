import React, { useState } from 'react';
import { 
  Gamepad2, 
  Monitor, 
  Globe, 
  Copy, 
  Check, 
  Info, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ValheimServerConfig } from '../types';

interface ConnectionGuideProps {
  config: ValheimServerConfig;
}

export const ConnectionGuide: React.FC<ConnectionGuideProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'ingame' | 'steam' | 'crossplay'>('ingame');
  const [copied, setCopied] = useState(false);

  const fullAddress = `${config.domain}:${config.gamePort}`;
  const queryAddress = `${config.domain}:${config.queryPort}`;

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 rounded-2xl bg-[#0d131f] border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Connection Handbook</span>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-100">
            How to Join the dahLRealm Server
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step instructions for PC Steam, In-Game Browser, and Console Crossplay.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('ingame')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'ingame'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>In-Game Direct</span>
          </button>
          <button
            onClick={() => setActiveTab('steam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'steam'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Steam Favorites</span>
          </button>
          <button
            onClick={() => setActiveTab('crossplay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'crossplay'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Crossplay (Xbox)</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        
        {/* Method 1: In-Game Direct Connect */}
        {activeTab === 'ingame' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-semibold text-slate-200">Launch Valheim</h4>
                <p className="text-slate-400 leading-relaxed">
                  Select your character in the main menu, click <strong className="text-slate-300">Start Game</strong>, and navigate to the <strong className="text-slate-300">Join Game</strong> tab.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-semibold text-slate-200">Click &apos;Join IP&apos;</h4>
                <p className="text-slate-400 leading-relaxed">
                  Click the <strong className="text-slate-300">Join IP</strong> button at the bottom of the server browser and enter the address below:
                </p>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 font-mono text-amber-300 text-[11px]">
                  <span>{fullAddress}</span>
                  <button onClick={() => copyAddress(fullAddress)} className="text-slate-400 hover:text-white">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-semibold text-slate-200">Enter Realm Password</h4>
                <p className="text-slate-400 leading-relaxed">
                  When prompted, enter the password. {config.passwordHint ? `(Hint: ${config.passwordHint})` : 'Ask in the dahLRealm community for entry.'}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Method 2: Steam Favorites */}
        {activeTab === 'steam' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-semibold text-slate-200">Open Steam Server Browser</h4>
                <p className="text-slate-400 leading-relaxed">
                  In the top Steam client menu, click <strong className="text-slate-300">View → Game Servers</strong>, then switch to the <strong className="text-slate-300">Favorites</strong> tab.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-semibold text-slate-200">Add Query Port (2457)</h4>
                <p className="text-slate-400 leading-relaxed">
                  Click the &apos;+&apos; button at the bottom and enter the Steam query address:
                </p>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-[11px]">
                  <span>{queryAddress}</span>
                  <button onClick={() => copyAddress(queryAddress)} className="text-slate-400 hover:text-white">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-semibold text-slate-200">One-Click Connect</h4>
                <p className="text-slate-400 leading-relaxed">
                  Right-click <strong className="text-slate-300">{config.name}</strong> and click <strong className="text-slate-300">Connect to Server</strong>. Steam will automatically boot Valheim!
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Method 3: Crossplay (Xbox / Game Pass) */}
        {activeTab === 'crossplay' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-200">Crossplay is Enabled on dahLRealm</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Our dedicated server runs with PlayFab crossplay support enabled. Players on Xbox One, Xbox Series X|S, and PC Game Pass can connect directly using the IP or by searching for <strong className="text-slate-200">&quot;dahLRealm&quot;</strong> in the Community Server tab.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <span className="font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      Direct Address: {fullAddress}
                    </span>
                    <button 
                      onClick={() => copyAddress(fullAddress)}
                      className="text-amber-400 hover:text-amber-300 font-medium"
                    >
                      {copied ? 'Copied!' : 'Copy Address'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
