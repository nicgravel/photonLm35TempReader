const serverHost = 'localhost';
const serverDbHost = serverHost;

module.exports = {
    url: process.env.PHOTON_URL,
    token: process.env.PHOTON_TOKEN,
    interval: 30,
	mysql: {
		connection: {
			connectionLimit: 10,
			database: "templogger",
			host: serverDbHost,
			user: 'root',
			password: 'allo123',
			supportBigNumbers: 'true',
			insecureAuth: true,
			timezone: 'Z'
		}
	}	
};