import type { Clue } from "../../types.ts";
import "./Clues.css";
function Clues({ clues }: { clues: Clue[] }) {
  const acrossClues = clues.filter((clue) => clue.Orientation === "A");
  const downClues = clues.filter((clue) => clue.Orientation === "D");

  return (
    <div className="clues-container">
      <div className="clues-section">
        <h3>Across</h3>
        {acrossClues.map((clue) => (
          <div key={clue.Number} className="clue">
            <span className="clue-number">{clue.Number}.</span> {clue.Clue}
          </div>
        ))}
      </div>
      <div className="clues-section">
        <h3>Down</h3>
        {downClues.map((clue) => (
          <div key={clue.Number} className="clue">
            <span className="clue-number">{clue.Number}.</span> {clue.Clue}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Clues;
