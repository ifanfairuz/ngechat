module.exports = {
  apps: [
    {
      name: "ngechat",
      script: "npm run start",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      error_file: "./logs/error.log",
      log_file: "./logs/log.log",
      time: true,
      autorestart: true,
      exec_mode: "fork",
      max_memory_restart: "512M",
    },
  ],
};
