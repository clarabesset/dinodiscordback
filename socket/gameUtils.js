//const sampleGrid = require("./sampleGrid")

module.exports = (function() {
	currentGrid = [];
	// players = []; // do not use
	
	function closure() {
		var grid;
		return function(g) {
			if (!grid) {
				grid  = [...g];
			}
			return grid;
		}
	}
	
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
						color: players.color,
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
		const bkp = closure(grid);
		// console.log(bkp);
		
		 currentGrid = JSON.parse(JSON.stringify(grid));
		// console.log("currentGrid WTF ++>" , currentGrid)
		 return grid;
		// currentGrid = JSON.parse(JSON.stringify(sampleGrid));
		// console.log("currentGrid WTF ++>" , sampleGrid)
		//return sampleGrid;
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
	
	movePlayer = (direction, playerId) => {
		console.log("c ici grosse morue",direction, playerId);
		// const currentGrid = [...sampleGrid];
		//const currentGrid = [...grid];
		console.log("grid length =>", currentGrid.length);
		// console.log("grid backupée =========================> ");
		// console.log(currentGrid);
		// console.log('player ' + direction.playerId + ' moved ' + direction.direction);
		// const copiedGrid = [ ...currentGrid ];
		const currentCell = currentGrid.filter((cell) => {
			return cell.player && cell.player.id === playerId;
		})[0];
		console.log("------currentCell--------");
		console.log(currentCell);
		console.log("--------------");

		const takenCell = currentGrid.filter((cell) => cell.taken === true);
		console.log("------takenCell--------");
		console.log("takenCell length", takenCell.length);
		console.log("--------------");

		const findNextCell = (currentCellNb, nextDirection) => {
			const moves = {
				up: -10,
				right: 1,
				down: 10,
				left: -1
			};

			console.log("@FindNexCell --- currenCellNB", currentCellNb);

			// if (true) {
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
			// }
			const nextIndex = currentCellNb + moves[nextDirection];
			console.log('CURRENT CELL', currentCellNb);
			return nextIndex;
		};
		const findPreviousCell = (currentCellNb, nextDirection) => {
			if (nextDirection === 'up') {
				let previousCell = currentCellNb + 10;
				// console.log('previous cell ???', previousCell);
				// console.log(' currentCell ???', currentCell);
				return previousCell;
			} else if (nextDirection === 'down') {
				let previousCell = currentCellNb - 10;
				// console.log('previous cell ???', previousCell);
				return previousCell;
			} else if (nextDirection === 'left') {
				let previousCell = currentCellNb + 1;
				// console.log('previous cell ???', previousCell);
				return previousCell;
			} else if (nextDirection === 'right') {
				let previousCell = currentCellNb - 1;
				// console.log('previous cell ???', previousCell);
				return previousCell;
			}
			console.log('currentCellNb ???', currentCellNb);
		};

		const player = currentCell.player;
		const nextCell = findNextCell(currentCell.nb, direction);
		const previousCell = findPreviousCell(currentCell.nb, direction);
		console.log("--------YATAAA ???---------------");
		console.log('next cell', nextCell);
		console.log('previous cell', previousCell);
		console.log("-----------------------");
	
		if (nextCell) {
			// ----- reset current cell
			currentGrid[currentCell.nb].player = null;
			currentGrid[currentCell.nb].taken = false;
			currentGrid[currentCell.nb].color = player.color;
			// ----- set next cell
			currentGrid[nextCell].player = player;
			currentGrid[nextCell].taken = true;
			currentGrid[nextCell].color = player.color;
		}
	
		return currentGrid;
	};
	
	countPoints = (players) => {
		
		function calcPoints(player) {
			return currentGrid.reduce((acc, cell, index) => {
				if (cell.color === player.color) acc += 1;
				return acc;
			}, 0);
		}

		const results =  { // here, this represents results
			1: calcPoints(players[0]),
			2: calcPoints(players[1]),
			winner: this[1] > this[2] ? 1 : 2 ,
/* 			winnerColor: players[this.winner - 1].color
 */		};

		console.log("-----results ???----");
		console.log(results);
		console.log("---------");
		// const playersCell = this.state.currentGrid.filter(cell => cell.color === player.color);
		// var points = playersCell.length;
		// console.log("points --->", points);
		return results;
	};
	
	
	return {
		generateGrid,
		setPlayerPositionInGrid,
		movePlayer,
		countPoints
	}
}())