import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Save, 
  Check, 
  Server, 
  Globe, 
  Key, 
  Database,
  Users,
  MapPin,
  AlertCircle,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { ValheimServerConfig } from '../types';
import { useAuth } from '../context/AuthContext';

interface ServerConfigModalProps {
  config: ValheimServerConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<ValheimServerConfig>) => Promise<void>;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const { isAdmin, currentUser, openAuthModal } = useAuth();
  const [formData, setFormData] = useState<ValheimServerConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Access Control: If not an admin, block access with a clear message and quick sign-in prompt
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
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Admin Access Restricted
              </h3>
              <p className="text-xs text-slate-400">
                Server configuration is only available to the Realm Owner.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 mb-5">
            {currentUser ? (
              <>
                You are currently signed in as <strong className="text-white">{currentUser.username}</strong> (<span className="text-slate-400">{currentUser.role}</span>). To modify ports, realm name, and world settings, please sign in with the designated realm administrator account.
              </>
            ) : (
              <>
                You are not signed in. Please sign in with your administrator account to access realm ports, world seeds, and network configuration.
              </>
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Crown className="w-4 h-4" />
              <span>Sign In as Admin</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to update server configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1724] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Configure Valheim Dedicated Server
              </h2>
              <p className="text-xs text-slate-400">
                Manage host domain, ports, realm world seed, and capacity for dahLRealm
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Server Name */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
              Server Name / Title
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
              Description Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Domain and Ports */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                Domain / Host IP
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                Game Port (UDP)
              </label>
              <input
                type="number"
                value={formData.gamePort}
                onChange={(e) => setFormData({ ...formData, gamePort: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                Steam Query Port
              </label>
              <input
                type="number"
                value={formData.queryPort}
                onChange={(e) => setFormData({ ...formData, queryPort: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>
          </div>

          {/* World Name & Seed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                World Name
              </label>
              <input
                type="text"
                value={formData.worldName}
                onChange={(e) => setFormData({ ...formData, worldName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                World Seed
              </label>
              <input
                type="text"
                value={formData.worldSeed}
                onChange={(e) => setFormData({ ...formData, worldSeed: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Max Players & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                Max Player Capacity
              </label>
              <input
                type="number"
                min="1"
                max="64"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[11px]">
                Host Region / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Password Protection & Hint */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Password Protected</span>
                <span className="text-[11px] text-slate-400">Require password on connect</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isPasswordProtected}
                onChange={(e) => setFormData({ ...formData, isPasswordProtected: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
              />
            </div>

            {formData.isPasswordProtected && (
              <div>
                <label className="block font-medium text-slate-300 mb-1 font-mono uppercase text-[10px]">
                  Password Hint / Notice
                </label>
                <input
                  type="text"
                  value={formData.passwordHint || ''}
                  onChange={(e) => setFormData({ ...formData, passwordHint: e.target.value })}
                  placeholder="e.g. Ask in dahLRealm Discord #valheim"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
            )}
          </div>

          {/* Crossplay Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Crossplay (PlayFab)</span>
              <span className="text-[11px] text-slate-400">Allow Xbox & PC Game Pass players</span>
            </div>
            <input
              type="checkbox"
              checked={formData.crossplayEnabled}
              onChange={(e) => setFormData({ ...formData, crossplayEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
            />
          </div>

          {/* Monitoring Query Mode Selector */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <label className="block font-medium text-slate-300 font-mono uppercase text-[10px]">
              Statistics Monitoring Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, queryMode: 'live' })}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  formData.queryMode === 'live'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">⚡ Live Query (A2S)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Queries real server on port 2457 UDP</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, queryMode: 'manual' })}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  formData.queryMode === 'manual'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">🛠️ Manual Admin Override</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Extensive admin menu for all stats</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, queryMode: 'showcase' })}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  formData.queryMode === 'showcase'
                    ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">✨ Showcase Mode</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Realistic simulation for previews</div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
