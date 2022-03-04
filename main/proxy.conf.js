const PROXY_CONFIG = [
  {
    context: ['/api', '/assets'],
    target: 'http://localhost:8080',
    secure: false,
  },
  {
    context: ['/noty'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: false,
    ws: true,
  },
  {
    context: ['/micro/project'],
    target: 'http://localhost:4201',
    secure: false,
  },
  {
    context: ['/micro/matter'],
    target: 'http://localhost:4202',
    secure: false,
  },
];
module.exports = PROXY_CONFIG;

// 后端端口http://localhost:8080
