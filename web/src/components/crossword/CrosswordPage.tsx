import Crossword from "./components/Crossword";
import Clues from "./components/clues/Clues.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PuzzleData } from "./types.ts";
import type { Clue } from "./types.ts";
import "./CrosswordPage.css";
function CrosswordPage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const id = Number(puzzleId);
  const [workingPuzzle, setWorkingPuzzle] = useState<string[][]>([]);
  const [clues, setClues] = useState<Clue[]>([]);

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
    <div className="crossword-page">
      <Crossword workingPuzzle={workingPuzzle} />
      <Clues clues={clues} />
    </div>
  );
}

export default CrosswordPage;
