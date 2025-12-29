import { isBlockedCellChar } from "../constants/BlockedCellChars.ts";
import type { cellClueMapping } from "../components/crossword/types.ts";
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
