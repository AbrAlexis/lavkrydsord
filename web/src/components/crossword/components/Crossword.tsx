import Cell from "./Cell.tsx";
import "./Crossword.css";
import { isBlockedCellChar } from "../../../constants/BlockedCellChars.ts";
import { useMemo } from "react";

function getCellNumbers(puzzle: string[][]) {
  if (!puzzle.length) return [];
  const ans: (number | null)[][] = puzzle.map((row) => row.map(() => null));
  let counter = 1;

  for (let row = 0; row < puzzle.length; row++) {
    for (let col = 0; col < puzzle[row].length; col++) {
      if (isBlockedCellChar(puzzle[row][col])) continue;

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

function Crossword({
  workingPuzzle,
  cellSize,
}: {
  workingPuzzle: string[][];
  cellSize: number;
}) {
  const cols = workingPuzzle[0]?.length ?? 0;

  const numbers = useMemo(() => getCellNumbers(workingPuzzle), [workingPuzzle]);

  return (
    <div
      className="crossword"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
    >
      {workingPuzzle.flat().map((cellValue, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        return (
          <Cell
            key={index}
            value={isBlockedCellChar(cellValue) ? "" : cellValue}
            isBlocked={isBlockedCellChar(cellValue)}
            isSelected={false}
            number={numbers[row]?.[col] ?? null}
            onClick={() => {}}
          />
        );
      })}
    </div>
  );
}

export default Crossword;
