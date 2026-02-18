// Simpler proxy that handles all /api/nextleet requests
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Extract the path after /api/nextleet
  const fullPath = req.url.replace('/api/nextleet', '');
  const targetUrl = `https://api.nextleet.com${fullPath}`;
  
  console.log('Proxying request to:', targetUrl);
  
  const sessionCookie = 'NEXTLEET_SESSION=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTE5Yzc1NTdjMzYzMzljODdjNDk2ZSIsIm5hbWUiOiJQcmF0aGFtZXNoIEphZGhhdiIsImVtYWlsIjoiamFkaGF2cHJhdGhhbWVzaDMxMkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTFjenc3WFpWSDc5UkgzZ3g3YUM2dVo4X2hEY2Vzb1hpc0FGNWJxSU5iblRLY2hDQT1zOTYtYyIsImlhdCI6MTc3MTQ0MDgwMCwiZXhwIjoxNzc0MDMyODAwfQ.sGUZYiXw6UujDwcjS-UVLgvxKk-cbd9KJN_LIfhxcdU';
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from NextLeet API', details: error.message });
  }
};
