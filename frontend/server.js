const express = require('express')
const http = require('http')
const path = require('path')

const app = express()

app.set('port', process.env.PORT || 3001)
app.set('trust proxy', 1)

if (!module.parent) {
	var server = http.createServer(app)
	server.listen(app.get('port'), () => {
		console.log('listening on port', app.get('port'))
	})
}

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/build'))

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname + '/build/index.html'))
})
