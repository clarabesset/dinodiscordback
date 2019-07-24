

  static getDerivedStateFromProps(newProps, state) {
    console.log("@getdirevedstatefrompropsnewProps => ", newProps, state);
    if (newProps.playersFromServer.length !== state.players) {
      return {
        players: newProps.playersFromServer
      };
    } else return null;
  }
 
  getRandomInt(min, max) {
    return Math.floor(Math.random(min) * Math.floor(max));
  }
 function launchGame() {
    console.log("to the next step", this.state.players);
    this.setPlayerPositionInGrid(this.state.players[0], 0);
    this.setPlayerPositionInGrid(this.state.players[1], 99);
    this.setState({ step: 2 });
  }
  function get2RandCellIndexes() {
    const indexes = []; // cases choisies au hasard
    do {
      const nb = getRandomInt(1, 98);
      if (!indexes.includes(nb)) indexes.push(nb);
    } while (indexes.length !== 2); // 2 : nombres de météorites que l'on veut dès le départ
    return indexes;
  }
  function generateGrid() {
    const grid = [];
    const indexes = get2RandCellIndexes();
    var count = 0;
    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 9; j++) {
        const pos = indexes.indexOf(count); // if not found => return -1
        if (count === 0 || count === 99) {
          // les cases où les joueurs doivent être placés
          grid.push({
            x: i,
            y: j,
            nb: count,
            taken: true,
            color: "red",
            player: "",
            meteorite: false
            /* player: null */
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
        count++; // gui@check ça suis pas sûr
      }
    }
    this.setState({ currentGrid: grid });
  }
  setPlayerPositionInGrid(player, cellNumber) {
    const gridCopy = [...this.state.currentGrid];
    gridCopy[cellNumber].player = player;
    this.setState({
      currentGrid: gridCopy
    });
  }
  setPlayer = color => {
    this.props.socket.emit("player-join", color);
   
  };
  movePlayer = (direction, playerNumber) => {
    console.log("player " + playerNumber + " moved " + direction);
    const copiedGrid = [...this.state.currentGrid];
    const currentCell = copiedGrid.filter(
      cell => cell.player && cell.player.nb === playerNumber
    )[0].nb;
    const takenCell = copiedGrid.filter(cell => cell.taken === true);
    const findNextCell = (currentCellNb, nextDirection) => {
      const moves = {
        up: -10,
        right: 1,
        down: 10,
        left: -1
      };
      if (true) {
        for (let i = 0; i < takenCell.length; i++) {
          if (nextDirection === "up") {
            if (
              currentCellNb - 10 < 0 ||
              currentCellNb - 10 === takenCell[i].nb
            )
              return false;
          } else if (nextDirection === "down") {
            if (
              currentCellNb + 10 > 99 ||
              currentCellNb + 10 === takenCell[i].nb
            )
              return false;
          } else if (nextDirection === "left") {
            const forbiden = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
            if (
              forbiden.includes(currentCellNb) ||
              currentCellNb - 1 === takenCell[i].nb
            )
              return false;
          } else if (nextDirection === "right") {
            const forbiden = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
            if (
              forbiden.includes(currentCellNb) ||
              currentCellNb + 1 === takenCell[i].nb
            )
              return false;
          }
        }
      }
      const nextIndex = currentCellNb + moves[nextDirection];
      console.log("CURRENT CELL", currentCellNb);
      return nextIndex;
    };
    const findPreviousCell = (currentCellNb, nextDirection) => {
      if (nextDirection === "up") {
        let previousCell = currentCellNb + 10;
        console.log("previous cell ???", previousCell);
        console.log(" currentCell ???", currentCell);
        return previousCell;
      } else if (nextDirection === "down") {
        let previousCell = currentCellNb - 10;
        console.log("previous cell ???", previousCell);
        return previousCell;
      } else if (nextDirection === "left") {
        let previousCell = currentCellNb + 1;
        console.log("previous cell ???", previousCell);
        return previousCell;
      } else if (nextDirection === "right") {
        let previousCell = currentCellNb - 1;
        console.log("previous cell ???", previousCell);
        return previousCell;
      }
      console.log("currentCellNb ???", currentCellNb);
    
    };
    const nextCell = findNextCell(currentCell, direction);
    const previousCell = findPreviousCell(currentCell, direction);
    console.log("previous cell", previousCell);
    
    if (nextCell) {
      copiedGrid[currentCell].player = null;
      copiedGrid[currentCell].taken = false;
      copiedGrid[currentCell].color = this.state.players[0].color;
      copiedGrid[nextCell].player = this.state.players[playerNumber - 1];
      copiedGrid[nextCell].taken = true;
      copiedGrid[nextCell].color = this.state.players[0].color;
      this.setState({ currentGrid: copiedGrid }, () => {
        console.log(this.props.socket); // use socket to broadcast player's move
        // this.props.socket.emit("player-move", {})
        // socket.emit('news', { hello: 'world' });
      });
    }
   
    return;
   
  };
  countPoints = () => {};