import React, { useState, useEffect } from "react";
import type { Clue } from "../../types.ts";
import "./Clues.css";
function Clues({ clues }: { clues: Clue[] }) {
  const [acrossClues, setAcrossClues] = useState<Clue[]>([]);
  const [downClues, setDownClues] = useState<Clue[]>([]);

  const setCluesByOrientation = () => {
    const across: Clue[] = [];
    const down: Clue[] = [];
    clues.forEach((clue) => {
      if (clue.Orientation === "A") {
        across.push(clue);
      } else if (clue.Orientation === "D") {
        down.push(clue);
      }
    });
    setAcrossClues(across);
    setDownClues(down);
  };

  useEffect(() => {
    setCluesByOrientation();
  }, [clues]);
  return (
    <div>
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
