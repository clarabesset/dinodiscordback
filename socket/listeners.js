module.exports = function(io) {

   
    const utils = require('./gameUtils');

    console.log("C ICIIIIIIIIIIIIIIII",)
    

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

		socket.on('player-join', (payload) => {

            const { userInfos, color} = payload;

            console.log("player join ???");
            console.log(userInfos);

            if (players.length < 2) players.push({ color, id: userInfos._id, details: userInfos  });
            
            socket.emit('confirm-player-join', players);

            socket.broadcast.emit('remove-one-dino', color);           
        });
        
        socket.on("generate-grid", () => {
            const gridModel = utils.generateGrid(players);
            // const playerMove = utils.movePlayer(direction, playerId);
            
            // socket.emit("set-grid-model", gridModel);
            socket.emit('ready-to-play', {gridModel, players});
            socket.broadcast.emit('ready-to-play', {gridModel, players});
            // socket.emit('player-move', {direction, playerId});
            // socket.broadcast.emit('player-move', {direction, playerId});
            // socket.emit("set-grid-model", {gridModel, playerPosition});
            
        })

        socket.on("player-move", (payload) => {
            const { direction, playerId } = payload;
            console.log("player-move payload", payload);
            const updatedGrid = utils.movePlayer(direction, playerId);
           socket.emit("update-grid", updatedGrid);
           socket.broadcast.emit("update-grid", updatedGrid);
        })
	});
};
