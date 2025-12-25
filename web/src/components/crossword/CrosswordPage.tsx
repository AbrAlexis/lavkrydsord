import Crossword from "./components/Crossword";
import Clues from "./components/Clues";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PuzzleData, Clue } from "../types.ts";
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
        console.log("Fetched puzzle data:", data.WorkingPuzzle);
        setWorkingPuzzle(data.WorkingPuzzle);
        setClues(data.Clues);
      })
      .catch((error) => {
        console.error("Error fetching puzzle data:", error);
      });
  }, [id]);

  return (
    <div>
      <Crossword workingPuzzle={workingPuzzle} />
      <Clues clues={clues} />
    </div>
  );
}

export default CrosswordPage;
