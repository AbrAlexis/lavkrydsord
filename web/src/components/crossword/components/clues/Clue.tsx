import { forwardRef } from "react";
import type { ClueComponentProps } from "../../types";
import "./Clue.css";

const Clue = forwardRef<HTMLDivElement, ClueComponentProps>(
  (
    { number, text, isHighlighted, isOtherDirectionHighlighted, onClick },
    ref  ) => {
    return (
      <div
        ref={ref}
        className={`clue
          ${isHighlighted ? "highlighted" : ""}
          ${isOtherDirectionHighlighted ? "other-direction-highlighted" : ""}`}
        onClick={onClick}
      >
        <span className="clue-number">{number}.</span> {text}
      </div>
    );
  }
);

export default Clue;
