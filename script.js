//Puzzle
class Puzzle {
  constructor(state) {
    this.state = state;
    this.render();
    this.handleClick = this.handleClick.bind(this);
  }

  static initiate() {
    return new Puzzle(State.initiate());
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleClick(axis) {
    return function() {
      const relGrid = axis.getGrid();
      const template = relGrid.find(
          axisGrid => this.state.grid[axisGrid.y][axisGrid.x] === 0
      );
      if (template) {
        const newGrid = [...this.state.grid];
        gridMove(newGrid, axis, template);
        if (gridMap(newGrid)) {
          this.setState({
            status: "winner",
            grid: newGrid,
          });
        } else {
          this.setState({
            grid: newGrid,
          });
        }
      }
    }.bind(this);
  }

  render() {
    const { grid, status } = this.state;

    // Render generic grid
    const newGrid = document.createElement("ul");
    newGrid.className = "SlidingPuzzle";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const button = document.createElement("li");

        if (status === "initiate") {
          button.addEventListener("click", this.handleClick(new MakeGrid(j, i)));
        }

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        if (grid[i][j] === 0) {
          button.style.backgroundColor = "black";
          button.style.border = "black";
        }
        newGrid.appendChild(button);
      }
    }
    document.querySelector(".SlidingPuzzle").replaceWith(newGrid);

    if (status === "winner") {
      document.querySelector(".message").textContent = "Winner!";
    } else {
      document.querySelector(".message").textContent = "";
    }
  }
}

//Make Generic 3x3 Grid
class MakeGrid {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTop() {
    if (this.y === 0) return null;
    return new MakeGrid(this.x, this.y - 1);
  }

  getRight() {
    if (this.x === 2) return null;
    return new MakeGrid(this.x + 1, this.y);
  }

  getBottom() {
    if (this.y === 2) return null;
    return new MakeGrid(this.x, this.y + 1);
  }

  getLeft() {
    if (this.x === 0) return null;
    return new MakeGrid(this.x - 1, this.y);
  }

  getGrid() {
    return [
      this.getTop(),
      this.getRight(),
      this.getBottom(),
      this.getLeft()
    ].filter(axis => axis !== null);
  }

  getRandom() {
    const relGrid = this.getGrid();
    return relGrid[Math.floor(Math.random() * relGrid.length)];
  }
}
const gridMap = grid => {
  return (
      grid[0][0] === 1 &&
      grid[0][1] === 2 &&
      grid[0][2] === 3 &&
      grid[1][0] === 4 &&
      grid[1][1] === 5 &&
      grid[1][2] === 6 &&
      grid[2][0] === 7 &&
      grid[2][1] === 8 &&
      grid[2][2] === 0
  );
};

const getRandomGrid = () => {
  let grid = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

  let template = new MakeGrid(2, 2);
  for (let i = 0; i < 1000; i++) {
    const randomRelGrid = template.getRandom();
    gridMove(grid, template, randomRelGrid);
    template = randomRelGrid;
  }

  if (gridMap(grid)) return getRandomGrid();
  return grid;
};

const gridMove = (grid, axis1, axis2) => {
  const temp = grid[axis1.y][axis1.x];
  grid[axis1.y][axis1.x] = grid[axis2.y][axis2.x];
  grid[axis2.y][axis2.x] = temp;
};

class State {
  constructor(grid, status) {
    this.grid = grid;
    this.status = status;
  }

  static initiate() {
    return new State(getRandomGrid(),  "initiate");
  }
}



Puzzle.initiate();
