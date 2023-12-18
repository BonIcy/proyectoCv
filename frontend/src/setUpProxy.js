const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/cvs',
    createProxyMiddleware({
      target: 'http://localhost:6929',
      changeOrigin: true,
    })
  );
};