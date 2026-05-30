import https from 'https';

const options = {
    hostname: '192.168.178.189',
    path: '/httpapi.asp?command=getPlayerStatus',
    method: 'GET',
    rejectUnauthorized: false // Bypasses local self-signed certificate restriction
};

const hexToString = (hex) => {
    if (!hex || hex === 'null' || hex === 'unknown') return 'Unknown';
    return Buffer.from(hex, 'hex').toString('utf8');
};

const req = https.get(options, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const data = JSON.parse(rawData);
            
            console.log(`Status: ${data.status}`);
            console.log(`Volume: ${data.vol}%`);
            console.log(`Track:  ${hexToString(data.Title || data.title)}`);
            console.log(`Artist: ${hexToString(data.Artist || data.artist)}`);
            console.log(`Album:  ${hexToString(data.Album || data.album)}`);
        } catch (err) {
            console.error('Failed to parse WiiM response payload:', err.message);
        }
    });
});

req.on('error', (err) => {
    console.error('Network Error connecting to WiiM Ultra:', err.message);
});