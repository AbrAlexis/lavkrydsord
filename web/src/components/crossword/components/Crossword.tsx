import Cell from "./Cell.tsx";
import "./Crossword.css";
import "../../../constants/BlockedCellChars.ts";
import { isBlockedCellChar } from "../../../constants/BlockedCellChars.ts";
function Crossword({ workingPuzzle }: { workingPuzzle: string[][] }) {
  return (
    <div>
      {workingPuzzle.map((row, rowIndex) => (
        <div key={rowIndex} className="crossword-row">
          {row.map((cellValue, cellIndex) => (
            <Cell
              key={cellIndex}
              value={isBlockedCellChar(cellValue) ? "" : cellValue}
              isBlocked={cellValue === "#"}
              isSelected={false}
              onClick={() => {}}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Crossword;
