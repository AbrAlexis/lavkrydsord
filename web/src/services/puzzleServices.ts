import { isBlockedCellChar } from "../constants/BlockedCellChars.ts";
import type {
  cellClueMapping,
  Direction,
  ActiveClue,
} from "../components/crossword/types.ts";
export function flipDirection(direction: "across" | "down"): "down" | "across" {
  return direction === "across" ? "down" : "across";
}
export function getCellNumbers(puzzle: string[][]) {
  if (!puzzle.length) return [];
  const ans: (number | null)[][] = puzzle.map((row) => row.map(() => null));
  let counter = 1;

  for (let row = 0; row < puzzle.length; row++) {
    for (let col = 0; col < puzzle[row].length; col++) {
      if (isBlockedCellChar(puzzle[row][col])) {
        continue;
      }

      if (
        row === 0 ||
        col === 0 ||
        isBlockedCellChar(puzzle[row - 1][col]) ||
        isBlockedCellChar(puzzle[row][col - 1])
      ) {
        ans[row][col] = counter++;
      }
    }
  }
  return ans;
}

export function getBelongingClueNumbers(
  puzzleWithNumbers: (number | null)[][],
  workingPuzzle: string[][]
) {
  const res: cellClueMapping[][] = [];
  for (let row = 0; row < puzzleWithNumbers.length; row++) {
    res.push([]);
    for (let col = 0; col < puzzleWithNumbers[row].length; col++) {
      if (isBlockedCellChar(workingPuzzle[row][col])) {
        res[row].push({ acrossClueNumber: null, downClueNumber: null });
        continue;
      }

      let acrossClueNumber: number | null = null;
      let downClueNumber: number | null = null;

      //across
      if (col === 0) {
        acrossClueNumber = puzzleWithNumbers[row][col];
      } else if (isBlockedCellChar(workingPuzzle[row][col - 1])) {
        acrossClueNumber = puzzleWithNumbers[row][col];
      } else {
        acrossClueNumber = res[row][col - 1].acrossClueNumber;
      }

      //down
      if (row === 0) {
        downClueNumber = puzzleWithNumbers[row][col];
      } else if (isBlockedCellChar(workingPuzzle[row - 1][col])) {
        downClueNumber = puzzleWithNumbers[row][col];
      } else {
        downClueNumber = res[row - 1][col].downClueNumber;
      }
      res[row].push({ acrossClueNumber, downClueNumber });
    }
  }
  return res;
}

export function createClueNumberToCellLocationMap(
  clueNumbersGrid: (number | null)[][]
) {
  const res: Record<number, { row: number; col: number }> = {};
  for (let row = 0; row < clueNumbersGrid.length; row++) {
    for (let col = 0; col < clueNumbersGrid[row].length; col++) {
      const cellNumber = clueNumbersGrid[row][col];
      if (cellNumber !== null) {
        res[cellNumber] = { row, col };
      }
    }
  }
  return res;
}

export function nextCell(
  location: { row: number; col: number } | null,
  workingPuzzle: string[][],
  direction: Direction
) {
  if (!location) return null;
  switch (direction) {
    case "across":
      if (
        location.col == workingPuzzle[0].length - 1 ||
        isBlockedCellChar(workingPuzzle[location.row][location.col + 1])
      ) {
        return null;
      } else {
        return { row: location.row, col: location.col + 1 };
      }
    case "down":
      if (
        location.row == workingPuzzle.length - 1 ||
        isBlockedCellChar(workingPuzzle[location.row + 1][location.col])
      ) {
        return null;
      } else {
        return { row: location.row + 1, col: location.col };
      }
  }
}

export function previousCell(
  location: { row: number; col: number } | null,
  workingPuzzle: string[][],
  direction: Direction
) {
  if (!location) return null;
  switch (direction) {
    case "across":
      if (
        location.col == 0 ||
        isBlockedCellChar(workingPuzzle[location.row][location.col - 1])
      ) {
        return null;
      } else {
        return { row: location.row, col: location.col - 1 };
      }
    case "down":
      if (
        location.row == 0 ||
        isBlockedCellChar(workingPuzzle[location.row - 1][location.col])
      ) {
        return null;
      } else {
        return { row: location.row - 1, col: location.col };
      }
  }
}

export function handleArrowKey(
  key: string,
  selectedCell: { row: number; col: number } | null,
  workingPuzzle: string[][]
): { row: number; col: number } | null {
  if (!selectedCell) return null;

  switch (key) {
    case "ArrowUp":
      if (
        selectedCell.row == 0 ||
        isBlockedCellChar(workingPuzzle[selectedCell.row - 1][selectedCell.col])
      ) {
        return selectedCell;
      } else {
        return { row: selectedCell.row - 1, col: selectedCell.col };
      }
    case "ArrowDown":
      if (
        selectedCell.row == workingPuzzle.length - 1 ||
        isBlockedCellChar(workingPuzzle[selectedCell.row + 1][selectedCell.col])
      ) {
        return selectedCell;
      } else {
        return { row: selectedCell.row + 1, col: selectedCell.col };
      }
    case "ArrowLeft":
      if (
        selectedCell.col == 0 ||
        isBlockedCellChar(workingPuzzle[selectedCell.row][selectedCell.col - 1])
      ) {
        return selectedCell;
      } else {
        return { row: selectedCell.row, col: selectedCell.col - 1 };
      }
    case "ArrowRight":
      if (
        selectedCell.col == workingPuzzle[0].length - 1 ||
        isBlockedCellChar(workingPuzzle[selectedCell.row][selectedCell.col + 1])
      ) {
        return selectedCell;
      } else {
        return { row: selectedCell.row, col: selectedCell.col + 1 };
      }
    default:
      return selectedCell;
  }
}

export function foo(
  selectedCell: { row: number; col: number } | null,
  cellClueMapping: cellClueMapping[][],
  direction: Direction
) {
  if (!selectedCell) return { acrossClueNumber: null, downClueNumber: null };
  return {
    number:
      direction === "across"
        ? cellClueMapping[selectedCell.row][selectedCell.col].acrossClueNumber
        : cellClueMapping[selectedCell.row][selectedCell.col].downClueNumber,
    direction: direction,
  };
}

export function getActiveClue(
  selectedCell: { row: number; col: number } | null,
  cellClueMapping: cellClueMapping[][],
  direction: Direction
): ActiveClue {
  if (!selectedCell) {
    return { number: null, direction: null };
  }

  const cell = cellClueMapping[selectedCell.row][selectedCell.col];

  return {
    number:
      direction === "across" ? cell.acrossClueNumber : cell.downClueNumber,
    direction,
  };
}
