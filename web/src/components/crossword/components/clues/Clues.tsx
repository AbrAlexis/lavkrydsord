import type { CluesProps, Direction } from "../../types.ts";
import ClueComponent from "./Clue.tsx";
import "./Clues.css";
import "./Clue.css";

const SECTIONS = [
  { label: "Across", orientation: "A", direction: "across" },
  { label: "Down", orientation: "D", direction: "down" },
] as const;

function Clues({
  clues,
  onClick,
  crosswordState,
  updateCrosswordState,
}: CluesProps) {
  const { activeClue, otherDirectionClueNumber } = crosswordState;

  return (
    <div className="clues-container">
      {SECTIONS.map(({ label, orientation, direction }) => (
        <div key={label} className="clues-section">
          <h3>{label}</h3>
          {clues
            .filter((clue) => clue.Orientation === orientation)
            .map((clue) => {
              const isHighlighted =
                activeClue?.number === clue.Number &&
                activeClue.direction === direction;

              // check if the clue is the selected cells other direction
              const isOtherDirectionHighlighted =
                activeClue?.direction !== direction &&
                otherDirectionClueNumber === clue.Number;

              return (
                <ClueComponent
                  key={clue.Number}
                  direction={direction}
                  number={clue.Number}
                  text={clue.Clue}
                  isHighlighted={isHighlighted}
                  isOtherDirectionHighlighted={isOtherDirectionHighlighted}
                  onClick={() => onClick(clue.Number, direction)}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}

export default Clues;
