const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware("/api", { target: "http://ec2-3-138-103-20.us-east-2.compute.amazonaws.com:8080" }));
    app.use(createProxyMiddleware("/algo", { target: "http://localhost:8000" }));
};