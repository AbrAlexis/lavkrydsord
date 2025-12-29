import type { CellProps } from "../types.ts";
import "./Cell.css";
function Cell({
  value,
  isBlocked,
  isSelected,
  isHighlighted,
  number,
  onClick,
}: CellProps) {
  return (
    <div
      className={`cell 
        ${isBlocked ? "blocked" : ""}
        ${isSelected ? "selected" : ""}
        ${isHighlighted ? "highlighted" : ""}`}
      onClick={onClick}
    >
      {value}
      {number !== null && <div className="cell-number">{number}</div>}
    </div>
  );
}

export default Cell;
