currentGrid = [];
players = [];

function getRandomInt(min, max) {
	return Math.floor(Math.random(min) * Math.floor(max));
}

function get2RandCellIndexes() {
	const indexes = []; // cases choisies au hasard
	do {
		const nb = getRandomInt(1, 98);
		if (!indexes.includes(nb)) indexes.push(nb);
	} while (indexes.length !== 2); // 2 : nombres de météorites que l'on veut dès le départ
	return indexes;
}

function generateGrid(players) {
	const grid = [];
	const indexes = get2RandCellIndexes();
	var count = 0;
	for (let i = 0; i <= 9; i++) {
		for (let j = 0; j <= 9; j++) {
			const pos = indexes.indexOf(count); // if not found => return -1
			if (count === 0 || count === 99) {
				// les cases où les joueurs doivent être placés
				let player = count === 0 ? players[0] : players[1]
				grid.push({
					x: i,
					y: j,
					nb: count,
					taken: true,
					color: player.color,
					player: player,
					meteorite: false
				});
			} else {
				grid.push({
					x: i,
					y: j,
					nb: count,
					taken: pos !== -1 ? true : false,
					color: null,
					meteorite: pos !== -1 ? true : false,
					player: null
				});
			}
			count++;
		}
	}
	return grid;
}

function setPlayerPositionInGrid(player, cellNumber) {
	const gridCopy = [ ...currentGrid ];
	gridCopy[cellNumber].player = player;
	currentGrid = gridCopy;
}

// handleMovements = (e) => {
//   e.preventDefault();
//   const moves = {
//     40: 'down',
//     39: 'right',
//     37: 'left',
//     38: 'up'
//   };
//   movePlayer(moves[e.keyCode], 1);
// };

movePlayer = (direction, playerNumber) => {
	console.log('player ' + playerNumber + ' moved ' + direction);
	const copiedGrid = [ ...currentGrid ];
	const currentCell = copiedGrid.filter((cell) => cell.player && cell.player.nb === playerNumber)[0].nb;
	const takenCell = copiedGrid.filter((cell) => cell.taken === true);
	const findNextCell = (currentCellNb, nextDirection) => {
		const moves = {
			up: -10,
			right: 1,
			down: 10,
			left: -1
		};
		if (true) {
			for (let i = 0; i < takenCell.length; i++) {
				if (nextDirection === 'up') {
					if (currentCellNb - 10 < 0 || currentCellNb - 10 === takenCell[i].nb) return false;
				} else if (nextDirection === 'down') {
					if (currentCellNb + 10 > 99 || currentCellNb + 10 === takenCell[i].nb) return false;
				} else if (nextDirection === 'left') {
					const forbiden = [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90 ];
					if (forbiden.includes(currentCellNb) || currentCellNb - 1 === takenCell[i].nb) return false;
				} else if (nextDirection === 'right') {
					const forbiden = [ 9, 19, 29, 39, 49, 59, 69, 79, 89, 99 ];
					if (forbiden.includes(currentCellNb) || currentCellNb + 1 === takenCell[i].nb) return false;
				}
			}
		}
		const nextIndex = currentCellNb + moves[nextDirection];
		console.log('CURRENT CELL', currentCellNb);
		return nextIndex;
	};
	const findPreviousCell = (currentCellNb, nextDirection) => {
		if (nextDirection === 'up') {
			let previousCell = currentCellNb + 10;
			console.log('previous cell ???', previousCell);
			console.log(' currentCell ???', currentCell);
			return previousCell;
		} else if (nextDirection === 'down') {
			let previousCell = currentCellNb - 10;
			console.log('previous cell ???', previousCell);
			return previousCell;
		} else if (nextDirection === 'left') {
			let previousCell = currentCellNb + 1;
			console.log('previous cell ???', previousCell);
			return previousCell;
		} else if (nextDirection === 'right') {
			let previousCell = currentCellNb - 1;
			console.log('previous cell ???', previousCell);
			return previousCell;
		}
		console.log('currentCellNb ???', currentCellNb);
	};
	const nextCell = findNextCell(currentCell, direction);
	const previousCell = findPreviousCell(currentCell, direction);
	console.log('previous cell', previousCell);

	if (nextCell) {
		copiedGrid[currentCell].player = null;
		copiedGrid[currentCell].taken = false;
		copiedGrid[currentCell].color = players[0].color;
		copiedGrid[nextCell].player = players[playerNumber - 1];
		copiedGrid[nextCell].taken = true;
		copiedGrid[nextCell].color = players[0].color;
		currentGrid = copiedGrid;
	}

	return;
};



module.exports = {
	generateGrid
}