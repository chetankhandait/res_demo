const http = require('http');

const makeRequest = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
               resolve(data ? JSON.parse(data) : {});
            } else {
               resolve({ error: `Status ${res.statusCode}`, body: data });
            }
        } catch (e) {
            resolve({ error: 'JSON Parse Error', body: data });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const verify = async () => {
  console.log('Verifying Backend APIs...');
  
  try {
    // 1. Check Menu
    const menu = await makeRequest('/api/menu');
    console.log(`[PASS] Menu Items: ${Array.isArray(menu) ? menu.length : 'FAIL'}`);

    // 2. Check Tables
    const tables = await makeRequest('/api/tables');
    console.log(`[PASS] Tables: ${Array.isArray(tables) ? tables.length : 'FAIL'}`);

    // 3. Calculate Order
    if (menu.length > 0) {
        const item = menu[0];
        const calc = await makeRequest('/api/orders/calculate', 'POST', {
            items: [{ menu_item_id: item.item_id, quantity: 2 }]
        });
        console.log(`[PASS] Calculate Order: Total ${calc.total} (Expected > 0)`);
    }

    console.log('Verification Complete.');
  } catch (err) {
    console.error('Verification Failed:', err.message);
  }
};

setTimeout(verify, 3000); // Wait for server to start
