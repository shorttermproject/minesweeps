import style from "./Grid.module.css";
import { useCallback, useState } from "react";

let collumns = 10;
let rows = 10;
let mines = 10;
// number from 0 - 8, flag, empty, mine

// interface Cell {
//   hidden: boolean;
//   bomb: boolean;
//   value:
// }
const BOMB = "💣";
const EMPTY = " ";

function Row({ row, grid, onClick }) {
  const colComp = [];
  for (let col = 0; col < collumns; col++) {
    let cell = grid[row][col];
    colComp.push(
      <div key={col} onClick={() => onClick(row, col)} className={style.cell}>
        {cell.hidden ? <div className={style.hidden}>{EMPTY}</div> : cell.value}
      </div>
    );
  }
  return <div className={style.row}>{colComp}</div>;
}

function randomizeMineLocation() {
  let offset = Math.floor(Math.random() * rows * collumns);
  let rowOffset = Math.floor(offset / collumns);
  let colOffset = Math.floor(offset % collumns);

  return { rowOffset, colOffset };
}

function initializeGrid() {
  let grid = [];
  for (let row = 0; row < rows; row++) {
    grid.push([]);
    for (let col = 0; col < collumns; col++) {
      grid[row].push({ hidden: true, value: EMPTY });
    }
  }
  let mineCount = mines;

  // fill the grid with random bombs
  while (mineCount) {
    let { rowOffset, colOffset } = randomizeMineLocation();
    if (grid[rowOffset][colOffset].value !== BOMB) {
      grid[rowOffset][colOffset].value = BOMB;
      mineCount--;
    }
  }
  // fill the cells with the values
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < collumns; col++) {
      const val = getCellValue(row, col, grid);
      if (grid[row][col].value !== BOMB) {
        grid[row][col].value = val ? val : EMPTY;
      }
    }
  }

  return grid;
}

function getCellValue(rowOffset, colOffset, grid) {
  let value = 0;
  for (
    let row = Math.max(0, rowOffset - 1);
    row <= Math.min(rowOffset + 1, rows - 1);
    row++
  ) {
    for (
      let col = Math.max(0, colOffset - 1);
      col <= Math.min(colOffset + 1, collumns - 1);
      col++
    ) {
      if (grid[row][col].value === BOMB) {
        value++;
      }
    }
  }
  return value;
}

function revealCell(rowOffset, colOffset, grid, visited = {}) {
  visited[`${rowOffset},${colOffset}`] = true;

  const cell = grid[rowOffset][colOffset];
  cell.hidden = false;
  // recursivly reveal all the neighboring cells
  if (cell.value === EMPTY) {
    for (
      let row = Math.max(0, rowOffset - 1);
      row <= Math.min(rowOffset + 1, rows - 1);
      row++
    ) {
      for (
        let col = Math.max(0, colOffset - 1);
        col <= Math.min(colOffset + 1, collumns - 1);
        col++
      ) {
        if (grid[row][col].value === EMPTY && !visited[`${row},${col}`]) {
          revealCell(row, col, grid, visited);
        }
        grid[row][col].hidden = false;
      }
    }
  }
}

export function Grid() {
  let [grid, setGrid] = useState(initializeGrid);

  let handleCellClick = useCallback(
    (row, col) => {
      revealCell(row, col, grid);
      // game over
      if (grid[row][col].value === BOMB) {
        setTimeout(() => {
          document.write("GAME_OVER");
        }, 1000);
      }

      setGrid([...grid]);
    },
    [grid]
  );

  let rowComp = [];
  for (let row = 0; row < rows; row++) {
    rowComp.push(
      <Row key={row} row={row} grid={grid} onClick={handleCellClick} />
    );
  }
  return <div>{rowComp}</div>;
}
