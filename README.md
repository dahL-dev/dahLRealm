# dahLRealm Gaming Servers • Live Portal

A dedicated gaming infrastructure portal and live statistics dashboard for **dahLRealm**, featuring real-time telemetry, Steam A2S query integration, and connection guides for the **Valheim Dedicated Server**.

---

## 🚀 Quick Start (Local & Self-Hosted)

### Prerequisites
- Node.js 20+ installed
- npm / yarn / pnpm

### Installation
```bash
# 1. Clone your repository
git clone https://github.com/<YOUR_USERNAME>/dahLRealm.git
cd dahLRealm

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# App runs at http://localhost:3000
```

### Production Build & Run
```bash
# Compile client and server bundle
npm run build

# Start production server
npm start
```

---

## 📦 How to Upload / Push to Your GitHub

### Option A: Direct Push via Git CLI
```bash
# Initialize git if needed
git init
git add .
git commit -m "feat: dahLRealm gaming servers live statistics portal"

# Set branch and remote
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/dahLRealm.git

# Push code to your GitHub repo
git push -u origin main
```

### Option B: AI Studio Export
In Google AI Studio Build, click the **Settings / Export** icon in the upper right corner and select **"Export to GitHub"** or **"Download ZIP"**.

---

## ⚡ How to Setup Live Statistics for Valheim (Step-by-Step)

Valheim Dedicated Servers communicate using Valve's **Steam A2S Query Protocol** over **UDP**. For live statistics to function accurately, follow these three steps:

### 1. Valheim Server Startup Configuration
In your Valheim server launch script (`start_server.sh` or `start_server.bat`):
```bash
./valheim_server.x86_64 \
  -name "dahLRealm | Valheim Dedicated" \
  -port 2456 \
  -world "Dahlgard" \
  -password "YourSecretPassword" \
  -public 1
```
*Note: Always ensure `-public 1` is included so the server registers and responds to query probes.*

### 2. Network & Port Forwarding (Critical!)
Valheim dedicated servers use **two consecutive UDP ports**:
- **Game Port (Default: 2456 UDP)**: Used by game clients to play.
- **Query Port (Default: 2457 UDP)**: Used by Steam server browser and GameDig to fetch live statistics, ping, and player counts.

**In Your Router / Firewall:**
- Forward **UDP 2456** and **UDP 2457** to your host machine's local IP address.
- If your host runs Linux with UFW:
  ```bash
  sudo ufw allow 2456:2457/udp
  ```
- If your host runs Windows, allow incoming UDP on ports 2456 and 2457 in Windows Defender Firewall.

### 3. Domain & DNS Configuration (`valheim.dahlrealm.com`)
- In your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy):
  - Add an **A Record**:
    - **Name / Host**: `valheim` (or `@` for root domain)
    - **Target / Value**: Your server's **Public IPv4 Address**
  - **Important Cloudflare Note**: If using Cloudflare DNS, set proxy status to **DNS Only (Grey Cloud)**. Cloudflare's HTTP proxy (Orange Cloud) does not proxy UDP game traffic.

### 4. Switch to Live Mode
In the dahLRealm web portal:
1. Click **"Server Settings"** in the top navigation.
2. Ensure Domain is set to `valheim.dahlrealm.com` and Query Port is set to `2457`.
3. Toggle mode to **"Live Query (Steam A2S)"** and click **Save Configuration**.
4. You can also click **"Ping Probe"** or test query in the dashboard to test reachability instantly!

---

## 🐳 Running with Docker

You can easily run dahLRealm in Docker alongside your Valheim server:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t dahlrealm-portal .
docker run -d -p 3000:3000 --name dahlrealm-web dahlrealm-portal
```

---

## 🛡️ License
Apache-2.0. Built for the dahLRealm Gaming Community.
