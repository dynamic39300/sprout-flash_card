// ecosystem.config.cjs — PM2 进程配置
module.exports = {
  apps: [
    {
      name: 'flash-card',
      script: './server/dist/index.js',
      cwd: '/home/ubuntu/flash_card',   // 根据实际路径修改
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
