#!/bin/bash
# Heyama - VPS Deployment (Docker, Node, PM2 already installed)
# Usage: clone the repo, then run: chmod +x deploy.sh && ./deploy.sh
set -e

echo "=== Heyama Deployment ==="

# 1. Start MongoDB + MinIO (won't affect existing containers)
echo "[1/5] Starting MongoDB & MinIO..."
if command -v docker-compose &>/dev/null; then
  docker-compose up -d
else
  docker compose up -d
fi
sleep 3

# 2. Build API
echo "[2/5] Building API..."
cd api
npm install
cp .env.production .env
npm run build
cd ..

# 3. Build Web App
echo "[3/5] Building Web App..."
cd web
npm install
npm run build
cd ..

# 4. Start with PM2
echo "[4/5] Starting services with PM2..."
pm2 delete heyama-api 2>/dev/null || true
pm2 delete heyama-web 2>/dev/null || true

cd api && pm2 start dist/main.js --name heyama-api && cd ..
cd web && pm2 start npm --name heyama-web -- start && cd ..
pm2 save

# 5. Setup Apache VirtualHost
echo "[5/5] Configuring Apache..."
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite
sudo cp heyama.ancria.tech.conf /etc/apache2/sites-available/
sudo a2ensite heyama.ancria.tech.conf
sudo apache2ctl configtest && sudo systemctl reload apache2

echo ""
echo "=== Done! ==="
pm2 status
echo ""
echo "Site live at: http://heyama.ancria.tech"
echo ""
echo "For HTTPS, run:"
echo "  sudo apt install certbot python3-certbot-apache"
echo "  sudo certbot --apache -d heyama.ancria.tech"
