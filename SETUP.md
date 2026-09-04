# 🚀 End-to-End Guide: Hosting Hermes Agent on AWS Lightsail

A complete step-by-step production setup guide for deploying **Hermes Agent** with a 24/7 headless AI gateway, remote GUI desktop (XFCE4 + XRDP), and multi-channel messaging bridges (Telegram/WhatsApp) on **Amazon Lightsail**.

---

## 📑 Table of Contents
1. [Prerequisites & Architecture](#1-prerequisites--architecture)
2. [Step 1: AWS Account & Lightsail Instance Creation](#step-1-aws-account--lightsail-instance-creation)
3. [Step 2: Networking, Static IP & Firewall Configuration](#step-2-networking-static-ip--firewall-configuration)
4. [Step 3: Initial Server Setup & Swap Memory Allocation](#step-3-initial-server-setup--swap-memory-allocation)
5. [Step 4: GUI Desktop (XFCE4) & Remote Access (XRDP)](#step-4-gui-desktop-xfce4--remote-access-xrdp)
6. [Step 5: Node.js, Python & Dependencies Setup](#step-5-nodejs-python--dependencies-setup)
7. [Step 6: Hermes Agent Installation & Configuration](#step-6-hermes-agent-installation--configuration)
8. [Step 7: 24/7 Background Gateway Service (systemd)](#step-7-247-background-gateway-service-systemd)
9. [Step 8: Connecting Local Hermes to Remote Gateway](#step-8-connecting-local-hermes-to-remote-gateway)
10. [Step 9: Security Hardening & Maintenance](#step-9-security-hardening--maintenance)

---

## 1. Prerequisites & Architecture

```
                                  ┌───────────────────────────────┐
                                  │      User / Messaging Apps    │
                                  │  (Telegram / WhatsApp / RDP)  │
                                  └───────────────┬───────────────┘
                                                  │ Port 3389 / TLS
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ AWS Lightsail VPS (Ubuntu 24.04 LTS)                                             │
│                                                                                 │
│   ┌─────────────────────────┐          ┌────────────────────────────────────┐   │
│   │   XRDP + XFCE4 Desktop  │          │   Hermes Gateway (systemd service) │   │
│   │   - Google Chrome       │          │   - 24/7 Telegram / WhatsApp Bots  │   │
│   │   - Electron Desktop    │          │   - Agent Skills & Tools Engine    │   │
│   └─────────────────────────┘          └────────────────────────────────────┘   │
│                                                          │                      │
│                                                          ▼                      │
│                                        ┌────────────────────────────────────┐   │
│                                        │   AI Providers (OpenAI / DeepSeek) │   │
│                                        └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

- **AWS Account** with access to Amazon Lightsail.
- **SSH Key Pair** (`.pem` format).
- **Target OS**: Ubuntu 24.04 LTS (x86_64).
- **Recommended Plan**: 2 vCPU, 2 GB RAM (or 4 GB RAM) + 60 GB SSD.

---

## Step 1: AWS Account & Lightsail Instance Creation

1. **Log in to AWS Console**: Navigate to [https://lightsail.aws.amazon.com/](https://lightsail.aws.amazon.com/).
2. **Create Instance**:
   - **Location**: Select your preferred AWS Region (e.g., `ap-south-1` Mumbai, `us-east-1` N. Virginia).
   - **Platform**: Select **Linux/Unix**.
   - **Blueprint**: Choose **OS Only** ➔ **Ubuntu 24.04 LTS**.
3. **SSH Key Pair**:
   - Select default key or click **Create New Key Pair**.
   - Download the `.pem` private key file to your local machine (e.g., `~/.ssh/lightsail-key.pem`).
   - Secure permissions on your local machine:
     ```bash
     chmod 400 ~/.ssh/lightsail-key.pem
     ```
4. **Choose Instance Plan**:
   - Recommended: **$10/mo** (2 GB RAM, 2 vCPUs, 60 GB SSD, 3 TB transfer) or **$20/mo** (4 GB RAM).
5. **Name your instance**: e.g., `hermes-gateway-server` and click **Create instance**.

---

## Step 2: Networking, Static IP & Firewall Configuration

Dynamic public IPs change on instance reboot. Always attach a Static IP.

1. **Attach Static IP**:
   - In Lightsail, go to the **Networking** tab.
   - Click **Create static IP**, attach it to `hermes-gateway-server`, and click **Create**.
2. **Configure Firewall Ports**:
   - Go to your instance ➔ **Networking** tab ➔ **IPv4 Firewall**.
   - Add the following rules:

| Protocol | Port Range | Description | Source |
| :--- | :--- | :--- | :--- |
| **SSH** | `22` | Remote CLI management | `Any IPv4` (or your IP) |
| **Custom TCP** | `3389` | XRDP Remote Desktop GUI | `Any IPv4` |
| **Custom TCP** | `8000` / `8080` | Optional Web/API Gateway | `Any IPv4` |

---

## Step 3: Initial Server Setup & Swap Memory Allocation

Connect to your Lightsail VPS via SSH:
```bash
ssh -i ~/.ssh/lightsail-key.pem ubuntu@<YOUR_STATIC_IP>
```

### 1. Update Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Configure 2GB Swap Space
*(Essential for 2GB RAM instances to prevent Out-Of-Memory errors during AI workloads and compilation).*

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Persist across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Step 4: GUI Desktop (XFCE4) & Remote Access (XRDP)

If you need visual browser automation, desktop applications, or Electron GUIs:

### 1. Install XFCE4 & XRDP
```bash
sudo apt install -y xfce4 xfce4-goodies xrdp dbus-x11
sudo adduser xrdp ssl-cert
echo "xfce4-session" > ~/.xsession
sudo systemctl enable --now xrdp
```

### 2. Install Google Chrome
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
rm google-chrome-stable_current_amd64.deb
```

### 3. Set a Password for Ubuntu User (for RDP Login)
```bash
sudo passwd ubuntu
# Enter your secure password when prompted
```

> **To connect via RDP**: Open **Remote Desktop Connection** (Windows) or **Remmina / Microsoft Remote Desktop** (Mac/Linux), enter `<YOUR_STATIC_IP>:3389`, and log in with username `ubuntu`.

---

## Step 5: Node.js, Python & Dependencies Setup

### 1. Install Essential Build Tools & Audio/Video Libraries
```bash
sudo apt install -y git curl wget build-essential python3 python3-pip \
  python3-venv libasound2t64 libgbm1 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxcomposite1 libxdamage1 libxrandr2 libxkbcommon0 libpango-1.0-0 \
  libcairo2
```

### 2. Install Node.js (v20+ LTS via NVM)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

---

## Step 6: Hermes Agent Installation & Configuration

### 1. Set Up Isolated Python Environment
```bash
python3 -m venv ~/.hermes-venv
source ~/.hermes-venv/bin/activate
pip install --upgrade pip setuptools wheel
```

### 2. Clone and Install Hermes Agent
```bash
mkdir -p ~/.local/share
git clone https://github.com/NousResearch/Hermes-Agent.git ~/.local/share/hermes-agent
cd ~/.local/share/hermes-agent

# Install dependencies
pip install -r requirements.txt
pip install -e .
```

### 3. Create Hermes Configuration Directory & Environment File
```bash
mkdir -p ~/.hermes
cat << 'EOF' > ~/.hermes/.env
# Hermes Agent Configuration
HERMES_HOME=/home/ubuntu/.hermes
AI_PROVIDER=deepseek # or openai / anthropic
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_API_KEY=your_api_key_here
DEFAULT_MODEL=deepseek-chat

# Messaging Bridges (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
WHATSAPP_ENABLED=true
EOF
```

> ⚠️ Replace placeholders with your actual API keys. Never commit your `.env` to public repositories.

---

## Step 7: 24/7 Background Gateway Service (systemd)

To ensure Hermes runs continuously, restarts automatically on failure, and starts on boot:

### 1. Create systemd Service Unit
```bash
sudo tee /etc/systemd/system/hermes-gateway.service << 'EOF'
[Unit]
Description=Hermes Agent 24/7 Gateway Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/.local/share/hermes-agent
EnvironmentFile=/home/ubuntu/.hermes/.env
ExecStart=/home/ubuntu/.hermes-venv/bin/python -m hermes_agent.gateway
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
```

### 2. Enable and Start the Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable hermes-gateway
sudo systemctl start hermes-gateway
```

### 3. Check Service Status & Logs
```bash
# View current status
sudo systemctl status hermes-gateway

# View live streaming logs
journalctl -u hermes-gateway -f
```

---

## Step 8: Connecting Local Hermes to Remote Gateway

To route queries from your local development environment to the remote AWS Lightsail gateway:

### Option A: Secure SSH Port Forwarding Tunnel
From your **local machine**:
```bash
ssh -i ~/.ssh/lightsail-key.pem -N -L 8000:localhost:8000 ubuntu@<YOUR_STATIC_IP>
```
Your local tools can now connect directly to `http://localhost:8000`.

### Option B: Telegram / WhatsApp Remote Control
Send prompts directly to your configured Telegram bot or WhatsApp connected session. The remote Hermes Gateway on Lightsail executes tools, runs web browsers in headless mode, and streams responses back.

---

## Step 9: Security Hardening & Maintenance

1. **Install and Configure UFW Firewall**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 3389/tcp
   sudo ufw enable
   ```

2. **Install Fail2ban (Brute-Force Protection)**:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable --now fail2ban
   ```

3. **Log Rotation & Disk Clean-up**:
   ```bash
   # Clean package caches periodically
   sudo apt autoremove -y && sudo apt clean
   ```

---

### 🎉 Setup Complete!
Your Hermes Agent is now running 24/7 on AWS Lightsail with full multi-channel messaging support and remote GUI access.
