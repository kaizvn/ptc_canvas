/**
 * Created by KaiNguyen on 7/31/16.
 */

const fs = require('fs');

function socketModule(server) {
	var io = require('socket.io')(server);

	io.on('connection', function (socket) {
		console.log('new connection!');

		socket.on('getImageList', (channel)=> {
			//channel for multi canvas support
			let listImages = fs.readdirSync(__clientDir + '/images');

			socket.emit('images', listImages);

		});

		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
	});

	return io;
}


module.exports = socketModule;