import Cell from "./Cell.tsx";
import "./Crossword.css";
import { isBlockedCellChar } from "../../../constants/BlockedCellChars.ts";
import type { CrosswordProps } from "../types.ts";
import { flipDirection } from "../../../services/puzzleServices.ts";

function Crossword({
  workingPuzzle,
  cellSize,
  clueNumberGrid,
  cellClueMaps,
  gridValues,
  crosswordState,
  updateCrosswordState,
}: CrosswordProps) {
  const cols = workingPuzzle[0]?.length ?? 0;

  function onClick(row: number, col: number) {
    const clueMap = cellClueMaps[row][col];
    const selectedCell = crosswordState.selectedCell;
    if (!clueMap) return;
    if (isBlockedCellChar(workingPuzzle[row][col])) return;
    const isSameCell = selectedCell?.row === row && selectedCell?.col === col;
    const nextDirection = isSameCell
      ? flipDirection(crosswordState.direction)
      : crosswordState.direction;

    if (isSameCell) {
      updateCrosswordState({ direction: nextDirection });
      console.log("Flipped direction to", crosswordState.direction);
    }

    updateCrosswordState({ selectedCell: { row, col } });

    const currentClueNumber =
      nextDirection === "across"
        ? clueMap.acrossClueNumber
        : clueMap.downClueNumber;

    const otherClueNumber =
      nextDirection === "across"
        ? clueMap.downClueNumber
        : clueMap.acrossClueNumber;

    if (currentClueNumber !== null) {
      updateCrosswordState({
        activeClue: { direction: nextDirection, number: currentClueNumber },
        otherDirectionClueNumber: otherClueNumber,
      });
    }
  }
  console.log("Grid render");

  return (
    <div
      className="crossword"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
    >
      {workingPuzzle.flat().map((cellValue, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const isSelected =
          crosswordState.selectedCell?.row === row &&
          crosswordState.selectedCell?.col === col;
        const clueMap = cellClueMaps[row]?.[col];
        let isHighlighted = null;

        if (isSelected) {
          isHighlighted = false;
        } else if (crosswordState.direction === "across") {
          isHighlighted =
            crosswordState.activeClue?.number === clueMap.acrossClueNumber;
        } else {
          isHighlighted =
            crosswordState.activeClue?.number === clueMap.downClueNumber;
        }

        return (
          <Cell
            key={index}
            value={isBlockedCellChar(cellValue) ? "" : gridValues[row]?.[col]}
            isBlocked={isBlockedCellChar(cellValue)}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            number={clueNumberGrid[row]?.[col] ?? null}
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
