module.exports = function(server) {

    const socketIO = require("socket.io");
	const io = socketIO(server);
    const utils = require('./gameUtils');
    

	// SOCKET
	io.on('connection', (socket) => {
		console.log('user connected with socket id:', socket.id);
		const users = [];
		socket.on('room', (connected) => {
			users.push({ name: 'yolo' });
			console.log('room created', connected);
			console.log(users);
		});

		socket.on('disconnect', () => {
			players = [];
			console.log('user disconnected');
		});
	});

	let connectedPlayers = 0;
	let players = [];

	io.of('/room').on('connection', function(socket) {
		connectedPlayers += 1;

		socket.on('player-join', (color) => {
			if (players.length < 2) players.push({ color, nb: players.length + 1 });

			console.log('-----PLAYERS SETUp-----');
			console.log(players);

			socket.emit('confirm-player-join', players);
        });
        
        socket.on("generate-grid", () => {
            console.log("gimme a grid poto")
            const gridModel = utils.generateGrid(players);
            console.log(gridModel);

            socket.emit("set-grid-model", gridModel);
        })
	});
};
