
const sequelize = require('./config/database');
const { MenuItem } = require('./models');
const http = require('http');

const check = async () => {
    try {
        console.log('Connecting to DB...');
        await sequelize.authenticate();
        const count = await MenuItem.count();
        console.log(`MenuItems count in DB: ${count}`);
        
        console.log('Fetching from API...');
        http.get('http://localhost:5000/api/menu', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`API Status: ${res.statusCode}`);
                console.log(`API Response length: ${data.length}`);
                console.log(`API Response preview: ${data.substring(0, 100)}`);
                process.exit(0);
            });
        }).on('error', (err) => {
            console.error('API Request Error:', err.message);
            process.exit(1);
        });

    } catch (error) {
        console.error('DB/Script Error:', error);
        process.exit(1);
    }
};

check();
