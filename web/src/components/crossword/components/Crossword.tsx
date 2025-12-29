import Cell from "./Cell.tsx";
import "./Crossword.css";
import { isBlockedCellChar } from "../../../constants/BlockedCellChars.ts";
import { useMemo, useState } from "react";
import type { cellClueMapping, Direction } from "../types.ts";
import { flipDirection } from "../../../services/puzzleServices.ts";

function getCellNumbers(puzzle: string[][]) {
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

function getBelongingClueNumbers(
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

function Crossword({
  workingPuzzle,
  cellSize,
}: {
  workingPuzzle: string[][];
  cellSize: number;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [activeClue, setActiveClue] = useState<{
    direction: "across" | "down";
    number: number;
  } | null>(null);

  const [direction, setDirection] = useState<Direction>("across");
  const cols = workingPuzzle[0]?.length ?? 0;

  const numbers = useMemo(() => getCellNumbers(workingPuzzle), [workingPuzzle]);
  const cellClueMaps = useMemo(
    () => getBelongingClueNumbers(numbers, workingPuzzle),
    [numbers, workingPuzzle]
  );

  function onClick(row: number, col: number) {
    const clueMap = cellClueMaps[row][col];
    if (!clueMap) return;

    const isSameCell = selectedCell?.row === row && selectedCell?.col === col;
    const nextDirection = isSameCell ? flipDirection(direction) : direction;

    if (isSameCell) {
      setDirection(nextDirection);
      console.log("Flipped direction to", direction);
    }

    setSelectedCell({ row, col });

    if (nextDirection === "across") {
      if (clueMap.acrossClueNumber !== null) {
        setActiveClue({
          direction: nextDirection,
          number: clueMap.acrossClueNumber,
        });
      }
    } else if (nextDirection === "down") {
      if (clueMap.downClueNumber !== null) {
        setActiveClue({
          direction: nextDirection,
          number: clueMap.downClueNumber,
        });
      }
    }
  }

  return (
    <div
      className="crossword"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
    >
      {workingPuzzle.flat().map((cellValue, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const isSelected =
          selectedCell?.row === row && selectedCell?.col === col;
        const clueMap = cellClueMaps[row]?.[col];
        let isHighlighted = null;

        if (isSelected) {
          isHighlighted = false;
        } else if (direction === "across") {
          isHighlighted = activeClue?.number === clueMap.acrossClueNumber;
        } else {
          isHighlighted = activeClue?.number === clueMap.downClueNumber;
        }

        return (
          <Cell
            key={index}
            value={isBlockedCellChar(cellValue) ? "" : cellValue}
            isBlocked={isBlockedCellChar(cellValue)}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            number={numbers[row]?.[col] ?? null}
            acrossClueNumber={clueMap?.acrossClueNumber ?? null}
            downClueNumber={clueMap?.downClueNumber ?? null}
            onClick={() => {
              onClick(row, col);
            }}
          />
        );
      })}
    </div>
  );
}

export default Crossword;
