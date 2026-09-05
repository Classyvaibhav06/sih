# Complete Guide: Using Lightning.ai as a Free Cloud VPS with SSH Access

This guide explains how to set up a **free cloud Linux machine (Studio)** on [Lightning.ai](https://lightning.ai) and connect to it directly via **SSH** from your local terminal or IDE (VS Code, Cursor, Antigravity, etc.).

---

## 💻 Free Tier VPS Specifications

Every free Lightning.ai account includes:
* **CPU:** 4 vCPUs (Intel Xeon Platinum / AVX-512 support)
* **RAM:** 15–16 GB RAM + 13 GB Swap
* **Storage:** ~387 GB persistent SSD (all files in `/teamspace/studios/this_studio` are saved)
* **OS:** Ubuntu 24.04 LTS (x86_64)
* **Cost:** **$0 (100% Free compute on CPU tier)**

---

## 🛠️ Step 1: Create Your Cloud Studio (VPS)

1. Go to [lightning.ai](https://lightning.ai) and sign up or log in.
2. Click **"+ New Studio"** or **"Create Studio"** in your dashboard.
3. Give your Studio a name (e.g. `my-dev-vps`).
4. Ensure the machine type is set to **CPU** (4 vCPU / 16 GB RAM — $0.00/hr).
5. Click **"Start Studio"**. Within ~15–30 seconds, your cloud environment is ready.

---

## 🔑 Step 2: Get the SSH Setup Command

1. Open your running Studio on the Lightning.ai web interface.
2. Look at the top right or sidebar and click the **SSH / Terminal icon** (or select **"Connect via SSH"** from the settings menu).
3. Lightning AI will generate a one-line setup command that looks like this:

```bash
curl -s "https://lightning.ai/setup/ssh?t=YOUR_TOKEN&s=YOUR_STUDIO_ID" | bash
```

---

## 💻 Step 3: Run the Setup on Your Local Machine

Open your local terminal (Linux, macOS, or Windows WSL/Git Bash) and run the copied command:

```bash
curl -s "https://lightning.ai/setup/ssh?t=YOUR_TOKEN&s=YOUR_STUDIO_ID" | bash
```

### What this script does automatically:
* Generates an SSH private/public key pair and saves it to `~/.ssh/lightning_rsa`.
* Updates your local `~/.ssh/config` file with the host configuration:
  ```ssh-config
  Host ssh.lightning.ai
    IdentityFile ~/.ssh/lightning_rsa
    IdentitiesOnly yes
    ServerAliveInterval 15
    ServerAliveCountMax 4
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
  ```

---

## 🚀 Step 4: Connect to Your VPS

### Option A: From Terminal
Run the SSH connection command using your unique studio user ID:

```bash
ssh s_<your_studio_id>@ssh.lightning.ai
```

*(Example: `ssh s_01m1pav76k7hnmwn9vacg5rmst@ssh.lightning.ai`)*

### Option B: From VS Code / Antigravity / Cursor Remote-SSH
1. Install the **Remote - SSH** extension.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and select **"Remote-SSH: Connect to Host..."**.
3. Enter:
   ```text
   s_<your_studio_id>@ssh.lightning.ai
   ```
4. You now have a full VS Code remote development environment running directly on the cloud machine.

---

## ⚡ Step 5: VPS Lifecycle & Auto-Start Behavior

### 1. Auto-Sleep & Auto-Wake
* **Idle Policy:** If no active processes or SSH terminals are running, the machine enters **Sleep mode** after ~10–15 minutes of inactivity to save cloud resources.
* **Auto-Wake:** Whenever you want to use it, either click **"Start"** in the browser dashboard or simply run your SSH command. The machine boots up in ~15–30 seconds.
* **Data Persistence:** All files stored in `/teamspace/studios/this_studio/` are **never deleted**. Virtual environments, cloned repositories, and datasets persist permanently across sessions.

### 2. Run Scripts on Startup Automatically (`on_start.sh`)
You can automate tasks (e.g. launching servers or background jobs) every time the VPS wakes up:

Edit the startup script inside the studio:
```bash
nano /teamspace/studios/this_studio/.lightning_studio/on_start.sh
```

Example content:
```bash
#!/bin/bash
# Commands added here run automatically every time the Studio boots up
echo "Studio started at $(date)" >> /teamspace/studios/this_studio/boot.log
```
Make it executable:
```bash
chmod +x /teamspace/studios/this_studio/.lightning_studio/on_start.sh
```

---

## 💡 Step 6: Exposing Ports & Web Services

If you host an API (FastAPI, Flask) or web UI (Streamlit, Gradio, Next.js) on your VPS, you can expose it publicly in two ways:

### Method 1: Using Cloudflare Quick Tunnel (Free & Instant)
Download and run `cloudflared` to get an instant public HTTPS URL:
```bash
# Download cloudflared binary
curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o ~/bin/cloudflared
chmod +x ~/bin/cloudflared

# Expose your local port (e.g. port 8080)
~/bin/cloudflared tunnel --url http://127.0.0.1:8080
```

### Method 2: Lightning Plugin Ports
In the Studio web UI, open the **Plugin / Port Viewer** to expose internal ports (like `8080` or `3000`) to a public `*.lightning.ai` URL directly.
