#!/bin/bash
# backup.sh — 数据备份脚本，建议加入 crontab 每日自动执行
# crontab 示例（每天凌晨 3 点执行）:
#   0 3 * * * /home/ubuntu/flash_card/backup.sh >> /home/ubuntu/flash_card/logs/backup.log 2>&1

set -e

APP_DIR="/home/ubuntu/flash_card"       # 项目根目录（根据实际修改）
DATA_DIR="${APP_DIR}/data"               # DATA_DIR 与 .env 一致
BACKUP_DIR="/home/ubuntu/backups/flash_card"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.tar.gz"

mkdir -p "${BACKUP_DIR}"

echo "[${DATE}] 开始备份..."
tar -czf "${BACKUP_FILE}" \
    -C "${DATA_DIR}" . \
    --exclude="*.tmp"

SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
echo "[${DATE}] 备份完成: ${BACKUP_FILE} (${SIZE})"

# 只保留最近 30 天的备份
find "${BACKUP_DIR}" -name "backup_*.tar.gz" -mtime +30 -delete
echo "[${DATE}] 已清理 30 天前的旧备份"
