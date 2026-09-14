import React from 'react';
import { 
  Shield, 
  Wifi, 
  RotateCw, 
  Settings, 
  Radio, 
  Zap,
  LogIn,
  LogOut,
  Crown,
  User,
  Terminal,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  online: boolean;
  ping: number;
  activeVikings: number;
  maxPlayers: number;
  isRefreshing: boolean;
  refreshInterval: number;
  onSetRefreshInterval: (interval: number) => void;
  onRefresh: () => void;
  onOpenConfig: () => void;
  onOpenLiveSetup: () => void;
  onOpenDiagnostics: () => void;
  onOpenAdminStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  online,
  ping,
  activeVikings,
  maxPlayers,
  isRefreshing,
  refreshInterval,
  onSetRefreshInterval,
  onRefresh,
  onOpenConfig,
  onOpenLiveSetup,
  onOpenDiagnostics,
  onOpenAdminStats,
}) => {
  const { currentUser, isAdmin, logout, openAuthModal } = useAuth();

  return (
    <header className="border-b border-slate-800/80 bg-[#090d14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-950/40">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
                dahL<span className="text-amber-400">Realm</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide hidden sm:block">
              Dedicated Gaming Infrastructure & Realm Status
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Network Health Pill */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Valheim:</span>
              <span className="text-emerald-400 font-medium">{online ? 'Online' : 'Offline'}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Wifi className="w-3 h-3 text-amber-400" />
              <span>{ping}ms</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              <span className="text-amber-400 font-semibold">{activeVikings}</span>
              <span className="text-slate-500">/{maxPlayers} online</span>
            </span>
          </div>

          {/* Polling Rate Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 text-[11px] px-2 font-mono">Poll:</span>
            {[
              { label: '5s', value: 5000 },
              { label: '15s', value: 15000 },
              { label: '30s', value: 30000 },
              { label: 'Off', value: 0 },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => onSetRefreshInterval(opt.value)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                  refreshInterval === opt.value
                    ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            title="Refresh Live Statistics"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Live Query Setup Guide Button - ONLY ACCESSIBLE BY ADMIN */}
          {isAdmin && (
            <>
              <button
                id="header-live-setup-btn"
                onClick={onOpenLiveSetup}
                title="Setup Live Steam A2S Statistics"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Setup</span>
              </button>

              <button
                id="header-ping-probe-btn"
                onClick={onOpenDiagnostics}
                title="Execute Live Ping & Latency Probe"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-medium text-cyan-300 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ping Probe</span>
              </button>

              <button
                id="header-admin-stats-btn"
                onClick={onOpenAdminStats}
                title="Admin Live Stats Override & Control Menu"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-bold text-amber-300 transition-colors shadow-sm cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Stats Control</span>
              </button>

              <button
                id="header-config-btn"
                onClick={onOpenConfig}
                title="Admin Server Configuration"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Config</span>
              </button>
            </>
          )}

          {/* User Account / Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <div 
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs"
                title={`Signed in as ${currentUser.username} (${currentUser.role})`}
              >
                {currentUser.role === 'admin' ? (
                  <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Crown className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="font-medium text-slate-200 text-xs leading-none flex items-center gap-1">
                    {currentUser.username}
                    {currentUser.role === 'admin' && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        ADMIN
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {currentUser.vikingClan || 'Explorer'}
                  </span>
                </div>
              </div>

              <button
                id="header-logout-btn"
                onClick={logout}
                title="Sign out of account"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <button
                id="header-login-btn"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Log In</span>
              </button>

              <button
                id="header-register-btn"
                onClick={() => openAuthModal('register')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <span>Create Account</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
