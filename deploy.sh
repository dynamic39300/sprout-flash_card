#!/bin/bash
# deploy.sh — 在 ECS 服务器上执行，每次更新代码后运行
set -e

echo "▶ [1/5] 拉取最新代码..."
git pull origin main

echo "▶ [2/5] 安装依赖..."
npm ci --prefer-offline

echo "▶ [3/5] 构建前端..."
npm run build

echo "▶ [4/5] 重启服务..."
pm2 restart flash-card || pm2 start ecosystem.config.cjs --only flash-card

echo "▶ [5/5] 健康检查..."
sleep 2
curl -sf http://localhost:${PORT:-8787}/api/health && echo " ✓ 服务正常" || echo " ✗ 健康检查失败，请查看日志: pm2 logs flash-card"

echo "✅ 部署完成"
