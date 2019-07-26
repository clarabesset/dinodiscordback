module.exports = function(io) {
	const utils = require('./gameUtils');

	// SOCKET
	io.on('connection', (socket) => {
		// console.log('user connected with socket id:', socket.id);
		const users = [];
		socket.on('room', (connected) => {
			// users.push({ name: 'yolo' });
			// console.log('room created', connected);
			// console.log(users);
		});

		socket.on('disconnect', () => {
			// players = [];
			// console.log('user disconnected');
		});
	});

	let players = [];

	io.of('/room').on('connection', function(socket) {
		socket.on('player-join', (payload) => {
			const { userInfos, color } = payload;

			if (players.length < 2)
				players.push({ color, id: userInfos._id, details: userInfos, nb: players.length + 1 });

			socket.emit('confirm-player-join', players);

			socket.broadcast.emit('remove-one-dino', color);
		});

		socket.on('generate-grid', () => {
            if (players.length) {
                const gridModel = utils.generateGrid(players);
                socket.emit('ready-to-play', { gridModel, players });
                socket.broadcast.emit('ready-to-play', { gridModel, players });
            } else {
                socket.emit("error-log", "players length is 0 - should be 2");
                socket.broadcast.emit("error-log", "players length is 0 - should be 2");
            }

		});

		socket.on('player-move', (payload) => {
			const { direction, playerId } = payload;
			const updatedGrid = utils.movePlayer(direction, playerId);
			socket.emit('update-grid', updatedGrid);
			socket.broadcast.emit('update-grid', updatedGrid);
		});

		socket.on('get-result', (players) => {
			const result = utils.countPoints(players);
			socket.emit('set-result', result);
			player = [];
			socket.broadcast.emit('set-result', result);
		});
	});
};
