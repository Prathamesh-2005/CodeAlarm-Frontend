// Vercel serverless function to proxy NextLeet API requests
export default async function handler(req, res) {
  // Get the path after /api/nextleet/
  const path = req.query.path ? req.query.path.join('/') : '';
  
  // Construct the target URL
  const targetUrl = `https://api.nextleet.com/${path}`;
  
  // Session cookie for authentication
  const sessionCookie = 'NEXTLEET_SESSION=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTE5Yzc1NTdjMzYzMzljODdjNDk2ZSIsIm5hbWUiOiJQcmF0aGFtZXNoIEphZGhhdiIsImVtYWlsIjoiamFkaGF2cHJhdGhhbWVzaDMxMkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTFjenc3WFpWSDc5UkgzZ3g3YUM2dVo4X2hEY2Vzb1hpc0FGNWJxSU5iblRLY2hDQT1zOTYtYyIsImlhdCI6MTc3MTQ0MDgwMCwiZXhwIjoxNzc0MDMyODAwfQ.sGUZYiXw6UujDwcjS-UVLgvxKk-cbd9KJN_LIfhxcdU';
  
  try {
    // Forward the request to the NextLeet API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Cookie': sessionCookie,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from NextLeet API', details: error.message });
  }
}
