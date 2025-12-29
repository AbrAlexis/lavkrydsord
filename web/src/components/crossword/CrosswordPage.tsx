import Crossword from "./components/Crossword";
import Clues from "./components/clues/Clues.tsx";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { PuzzleData, Clue } from "./types.ts";

import "./CrosswordPage.css";
function CrosswordPage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const id = Number(puzzleId);
  const [workingPuzzle, setWorkingPuzzle] = useState<string[][]>([]);
  const [clues, setClues] = useState<Clue[]>([]);
  const [activeClue, setActiveClue] = useState<{
    direction: "across" | "down";
    number: number;
  } | null>(null);
  const [otherDirectionClueNumber, setOtherDirectionClueNumber] = useState<
    number | null
  >(null);

  const { cellSize, totalGridHeight } = useMemo(() => {
    const cols = workingPuzzle[0]?.length ?? 0;
    const rows = workingPuzzle.length;
    const size = Math.floor(
      (Math.min(window.innerWidth, window.innerHeight) * 0.9) /
        Math.max(1, cols)
    );
    return { cellSize: size, totalGridHeight: rows * size };
  }, [workingPuzzle]);
  async function fetchPuzzleData(puzzleId: number): Promise<PuzzleData> {
    const response = await fetch(`/api/puzzle/${puzzleId}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }

  useEffect(() => {
    if (isNaN(id)) {
      console.error("Invalid puzzle ID");
      return;
    }
    fetchPuzzleData(id)
      .then((data) => {
        setWorkingPuzzle(data.WorkingPuzzle);
        setClues(data.Clues);
      })
      .catch((error) => {
        console.error("Error fetching puzzle data:", error);
      });
  }, [id]);

  return (
    <div
      className="crossword-page"
      style={{ "--grid-height": `${totalGridHeight}px` } as React.CSSProperties}
    >
      <Crossword
        workingPuzzle={workingPuzzle}
        cellSize={cellSize}
        activeClue={activeClue}
        setActiveClue={setActiveClue}
        setOtherDirectionClueNumber={setOtherDirectionClueNumber}
      />
      <Clues
        clues={clues}
        activeClue={activeClue}
        otherDirectionClueNumber={otherDirectionClueNumber}
      />
    </div>
  );
}

export default CrosswordPage;
