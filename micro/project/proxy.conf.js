const PROXY_CONFIG = [{
  context: ['/api', '/assets'],
  target: 'http://localhost:8080',
  secure: false,
},
];
module.exports = PROXY_CONFIG;
