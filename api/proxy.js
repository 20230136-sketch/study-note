const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>シンプルプロキシ</title>
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5; }
        .container { text-align: center; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 85%; max-width: 400px; }
        input { width: 90%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; }
        button { width: 95%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>自作プロキシサイト</h2>
        <p>閲覧したいURLを入力してください</p>
        <input type="text" id="url" value="https://example.com"><br>
        <button onclick="goToPage()">ページを開く</button>
      </div>
      <script>
        function goToPage() {
          const targetUrl = document.getElementById('url').value;
          if (targetUrl) {
            window.location.href = '/go?url=' + encodeURIComponent(targetUrl);
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.all('/go', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URLが指定されていません。');

  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: { '^/go': '' },
    router: (req) => req.query.url,
    onError: (err, req, res) => {
      res.status(500).send('プロキシエラーが発生しました。');
    }
  })(req, res, next);
});

module.exports = app;
