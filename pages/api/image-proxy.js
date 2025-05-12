// pages/api/image-proxy.js

export default async function handler(req, res) {
    const { path } = req.query;
  
    if (!path || !path.startsWith('http://')) {
      return res.status(400).json({ error: 'Invalid or missing path parameter' });
    }
  
    try {
      const response = await fetch(path);
  
      if (!response.ok) {
        return res.status(response.status).send('Failed to fetch image');
      }
  
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
  
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  