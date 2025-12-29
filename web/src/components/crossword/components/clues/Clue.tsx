import type { ClueComponentProps } from "../../types";
import "./Clue.css";
function Clue({
  number,
  text,
  isHighlighted,
  isOtherDirectionHighlighted,
  onClick,
}: ClueComponentProps) {
  return (
    <div
      className={`clue
    ${isHighlighted ? "highlighted" : ""}
    ${isOtherDirectionHighlighted ? "other-direction-highlighted" : ""}`}
      onClick={onClick}
    >
      <span className="clue-number">{number}.</span> {text}
    </div>
  );
}

export default Clue;
