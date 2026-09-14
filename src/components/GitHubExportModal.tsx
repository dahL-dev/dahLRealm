import React, { useState } from 'react';
import { 
  Github, 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  ExternalLink, 
  Server, 
  Cpu, 
  CheckCircle2,
  CloudLightning
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [repoName, setRepoName] = useState('dahLRealm');
  const [githubUser, setGithubUser] = useState('YOUR_GITHUB_USERNAME');

  if (!isOpen) return null;

  const copyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const gitPushScript = `# 1. Open terminal in the project directory
git init
git add .
git commit -m "feat: dahLRealm gaming servers live statistics portal"

# 2. Add your GitHub repository remote
git branch -M main
git remote add origin https://github.com/${githubUser}/${repoName}.git

# 3. Push all code to your GitHub
git push -u origin main`;

  const buildDeployScript = `# Install dependencies
npm install

# Build for production (compiles React Vite & Express server bundle)
npm run build

# Start live production server
npm start`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1724] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide">
                Export to GitHub & Deploy Website
              </h2>
              <p className="text-xs text-slate-400">
                Upload all project files to your GitHub repository and host dahLRealm
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Method 1: AI Studio Built-in Export (Easiest) */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Download className="w-4 h-4" />
              <span>Option 1: Direct AI Studio Export (One-Click)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              In Google AI Studio Build, click the <strong>Settings / Export</strong> menu at the top right of your workspace window. You can select:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-950/80 border border-amber-500/20 text-slate-200">
                ⚡ <strong>Export to GitHub:</strong> Connects your GitHub account and pushes directly to a new or existing repo.
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-amber-500/20 text-slate-200">
                📦 <strong>Download ZIP:</strong> Downloads the full project as a .zip file ready to unpack.
              </div>
            </div>
          </div>

          {/* Method 2: Git CLI commands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-sm">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Option 2: Git Terminal Commands</span>
              </span>
              <button
                onClick={() => copyText(gitPushScript, 'git')}
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono"
              >
                {copiedSection === 'git' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied Commands!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            {/* Customizer inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  GitHub Username:
                </label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Repository Name:
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Code preview */}
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto select-all leading-relaxed">
              {gitPushScript}
            </pre>
          </div>

          {/* Method 3: Running on your website host (VPS / Cloud / Docker) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-sm">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Deploying to Your Website / VPS</span>
              </span>
              <button
                onClick={() => copyText(buildDeployScript, 'deploy')}
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono"
              >
                {copiedSection === 'deploy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Build Script</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed">
              You can run this website on any Linux VPS (Ubuntu/Debian), alongside your Valheim server, or on Docker/Render/Cloud Run.
            </p>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto select-all leading-relaxed">
              {buildDeployScript}
            </pre>
          </div>

          {/* Method 4: Deploying to Cloudflare Workers / Pages */}
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
              <CloudLightning className="w-4 h-4" />
              <span>Deploying to Cloudflare (Workers & Pages)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              In Cloudflare&apos;s <strong>Set up your application</strong> screen:
            </p>
            <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
              <div>• <strong>Build command:</strong> <code className="text-amber-300">npm run build</code></div>
              <div>• <strong>Deploy command:</strong> <code className="text-amber-300">npx wrangler deploy</code></div>
              <div>• <strong>Wrangler config:</strong> <code className="text-emerald-400">wrangler.json</code> (already included in this repository!)</div>
            </div>
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-[11px] leading-relaxed">
              💡 <strong>Cloudflare UDP Note:</strong> The entire website UI, Viking rosters, guides, and edge APIs work seamlessly on Cloudflare. However, Cloudflare edge servers do not allow raw outbound UDP sockets (which Steam A2S query uses). If you want 24/7 live Steam query pings from your dedicated server, run the included <code className="text-white">server.ts</code> on a VPS or alongside your Valheim server.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 font-mono text-[11px]">
            README.md file included with full documentation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
