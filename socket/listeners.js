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

	let players = [];

	io.of('/room').on('connection', function(socket) {

		socket.on('player-join', (color, id) => {

            /// TODO +> PASS ID HERE !!!!!

            if (players.length < 2) players.push({ color, nb: players.length + 1 });
            
            socket.emit('confirm-player-join', players);

            socket.broadcast.emit('remove-one-dino', color);           
        });
        
        socket.on("generate-grid", () => {
            const gridModel = utils.generateGrid(players);
            // const playerPosition = utils.setPlayerPositionInGrid(player, cellNumber);
            // console.log(gridModel);
            console.log("on est chauds bouillants alleezzz");
            
            // socket.emit("set-grid-model", gridModel);
            socket.emit('ready-to-play', {gridModel, players});
            socket.broadcast.emit('ready-to-play', {gridModel, players});
            // socket.emit("set-grid-model", {gridModel, playerPosition});
            
        })
	});
};
