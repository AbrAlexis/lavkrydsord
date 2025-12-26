import type { CellProps } from "../types.ts";
import "./Cell.css";
function Cell({ value, isBlocked, isSelected, number, onClick }: CellProps) {
  return (
    <div
      className={`cell ${isBlocked ? "blocked" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {value}
      {number !== null && <div className="cell-number">{number}</div>}
    </div>
  );
}

export default Cell;
