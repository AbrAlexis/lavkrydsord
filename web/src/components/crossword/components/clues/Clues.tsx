import type { Clue } from "../../types.ts";
import ClueComponent from "./Clue.tsx";
import "./Clues.css";
import "./Clue.css";

interface CluesProps {
  clues: Clue[];
  activeClue: { direction: "across" | "down"; number: number } | null;
  otherDirectionClueNumber: number | null;
}

const SECTIONS = [
  { label: "Across", orientation: "A", direction: "across" },
  { label: "Down", orientation: "D", direction: "down" },
] as const;

function Clues({ clues, activeClue, otherDirectionClueNumber }: CluesProps) {
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
                  number={clue.Number}
                  text={clue.Clue}
                  isHighlighted={isHighlighted}
                  isOtherDirectionHighlighted={isOtherDirectionHighlighted}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}

export default Clues;
