import Cell from "./Cell.tsx";
import "./Crossword.css";
import "../../../constants/BlockedCellChars.ts";
import { isBlockedCellChar } from "../../../constants/BlockedCellChars.ts";
import { useEffect, useState } from "react";

function Crossword({ workingPuzzle }: { workingPuzzle: string[][] }) {
  const [numbers, setNumbers] = useState<(number | null)[][]>([]);
  useEffect(() => {
    setNumbers(cellNumbers(workingPuzzle));
  }, [workingPuzzle]);

  function cellNumbers(puzzle: string[][]) {
    const ans: (number | null)[][] = puzzle.map((row) => row.map(() => null));
    let counter: number = 1;

    for (let row = 0; row < puzzle.length; row++) {
      for (let col = 0; col < puzzle[row].length; col++) {
        const cell = puzzle[row][col];
        if (isBlockedCellChar(cell)) {
          continue;
        }
        if (
          row === 0 ||
          col === 0 ||
          isBlockedCellChar(puzzle[row - 1][col]) ||
          isBlockedCellChar(puzzle[row][col - 1])
        ) {
          ans[row][col] = counter;
          counter++;
        }
      }
    }
    return ans;
  }

  return (
    <div>
      {workingPuzzle.map((row, rowIndex) => (
        <div key={rowIndex} className="crossword-row">
          {row.map((cellValue, cellIndex) => (
            <Cell
              key={cellIndex}
              value={isBlockedCellChar(cellValue) ? "" : cellValue}
              isBlocked={isBlockedCellChar(cellValue)}
              isSelected={false}
              number={numbers[rowIndex]?.[cellIndex] ?? null}
              onClick={() => {}}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Crossword;
