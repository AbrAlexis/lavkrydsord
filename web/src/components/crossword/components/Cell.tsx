import type { CellProps } from "../types.ts";

function Cell({ value, isBlocked, isSelected, onClick }: CellProps) {
  return (
    <div
      className={`cell ${isBlocked ? "blocked" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

export default Cell;
