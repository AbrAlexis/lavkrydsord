import Crossword from "./components/Crossword";
import Clues from "./components/Clues";
import { use, useEffect } from "react";
import { useParams } from "react-router-dom";
function CrosswordPage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const id = Number(puzzleId);

  async function fetchPuzzleData(puzzleId: number): Promise<string> {
    const response = await fetch(`/api/puzzle/${puzzleId}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.text();
  }

  useEffect(() => {
    if (isNaN(id)) {
      console.error("Invalid puzzle ID");
      return;
    }
    fetchPuzzleData(id)
      .then((data) => {
        console.log("Fetched puzzle data:", data);
      })
      .catch((error) => {
        console.error("Error fetching puzzle data:", error);
      });
  }, [id]);
  return (
    <div>
      <Crossword />
      <Clues />
    </div>
  );
}

export default CrosswordPage;
