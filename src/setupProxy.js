const { createProxyMiddleware } = require('http-proxy-middleware');
import { env } from './config.ts';

const prodProxy = (app) => {
    // put prod urls here
}

const devProxy = (app) => {
    app.use(createProxyMiddleware("/api", { target: "http://localhost:8080" }));
    app.use(createProxyMiddleware("/algo", { target: "http://localhost:8000" }));
}

module.exports = env === 'dev' ? devProxy : prodProxy;