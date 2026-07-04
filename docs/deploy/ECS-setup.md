# M3 · 阿里云 ECS 部署手册

> 目标：将青芽 Sprout 部署到阿里云 ECS，实现手机/电脑共享一份数据。

## 前置准备（本地确认）

```bash
# 确认生产构建通过
npm run build

# 确认测试全绿
npm test -w server
```

---

## 1. ECS 服务器初始化（首次登录后执行一次）

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2（全局）
sudo npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx

# 安装 Git
sudo apt install -y git

# 确认版本
node -v && npm -v && pm2 -v && nginx -v
```

---

## 2. 拉取代码

```bash
cd /home/ubuntu
git clone <你的仓库地址> flash_card
cd flash_card
```

---

## 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

修改以下关键项：

```env
NODE_ENV=production
PORT=8787
TZ=Asia/Shanghai
DATA_DIR=/home/ubuntu/flash_card/data
DB_FILE=/home/ubuntu/flash_card/data/flash_card.db
UPLOAD_DIR=/home/ubuntu/flash_card/data/uploads
MAX_UPLOAD_MB=5
```

---

## 4. 安装依赖 & 构建

```bash
npm ci
npm run build
```

---

## 5. 配置 PM2 进程

编辑 `ecosystem.config.cjs`，将 `cwd` 改为实际路径：

```javascript
cwd: '/home/ubuntu/flash_card',
```

启动服务：

```bash
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save                         # 保存进程列表
pm2 startup                      # 生成开机自启命令，按提示执行
```

验证：

```bash
pm2 status
curl http://localhost:8787/api/health
# 应返回: {"ok":true,"data":{"status":"up"}}
```

---

## 6. 配置 Nginx

```bash
# 将配置文件放到 Nginx 目录
sudo cp nginx/flash-card.conf /etc/nginx/sites-available/flash-card.conf

# 编辑配置，替换 server_name 和路径
sudo nano /etc/nginx/sites-available/flash-card.conf

# 启用站点
sudo ln -sf /etc/nginx/sites-available/flash-card.conf /etc/nginx/sites-enabled/

# 删除默认站点（如果有冲突）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置并重载
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. 阿里云安全组开放端口

在阿里云控制台 → ECS → 安全组 → 入方向规则，添加：

| 协议 | 端口 | 来源 | 说明 |
|------|------|------|------|
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS（有域名后） |

> **不要**开放 8787 端口（后端只允许本机 Nginx 访问）。

---

## 8. 访问验证

浏览器打开 `http://<你的ECS公网IP>/`，完整测试：
- [ ] 页面正常加载
- [ ] 记录一张卡片（含图片）
- [ ] 复习页正常翻卡 + 评分
- [ ] 坚持页热力图有数据

---

## 9. 配置每日自动备份

```bash
# 测试备份脚本
bash backup.sh

# 加入 crontab（每天凌晨 3 点备份）
crontab -e
```

在编辑器中添加：

```
0 3 * * * /home/ubuntu/flash_card/backup.sh >> /home/ubuntu/flash_card/logs/backup.log 2>&1
```

---

## 10. 后续更新（每次发版）

```bash
cd /home/ubuntu/flash_card
bash deploy.sh
```

---

## 11. 可选：HTTPS（有域名时）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（替换为你的域名）
sudo certbot --nginx -d your-domain.com

# 证书自动续期（Certbot 安装时已配置，确认一下）
sudo certbot renew --dry-run
```

---

## 常用运维命令

```bash
pm2 status                    # 查看进程状态
pm2 logs flash-card           # 查看实时日志
pm2 restart flash-card        # 重启服务
pm2 stop flash-card           # 停止服务

sudo nginx -t                 # 检查 Nginx 配置
sudo systemctl reload nginx   # 重载 Nginx（不中断连接）
sudo systemctl status nginx   # Nginx 状态

# 手动备份
bash /home/ubuntu/flash_card/backup.sh

# 查看磁盘使用（数据 + 图片）
du -sh /home/ubuntu/flash_card/data/
```
