const corsConfig = {
  origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = corsConfig;
