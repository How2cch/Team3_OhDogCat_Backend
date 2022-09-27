const corsConfig = {
  origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://07d8-2402-7500-5df-344e-9d5d-d9b2-5396-e4a1.jp.ngrok.io'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = corsConfig;
