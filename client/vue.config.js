module.exports = {
	outputDir: '../server/client',
	apiBaseRequest: process.env.NODE_ENV === "production"
		? '/api'
		: 'http://localhost:8080/api'
}