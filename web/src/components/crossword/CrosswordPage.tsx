import Crossword from "./components/Crossword";
import Clues from "./components/clues/Clues.tsx";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { PuzzleData, Clue, CrosswordState, Direction } from "./types.ts";
import "./CrosswordPage.css";
import {
  getCellNumbers,
  getBelongingClueNumbers,
  createClueNumberToCellLocationMap,
} from "../../services/puzzleServices.ts";

function CrosswordPage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const id = Number(puzzleId);
  const [workingPuzzle, setWorkingPuzzle] = useState<string[][]>([]);
  const [clues, setClues] = useState<Clue[]>([]);

  const [crosswordState, setCrosswordState] = useState<CrosswordState>({
    selectedCell: null,
    activeClue: null,
    otherDirectionClueNumber: null,
    direction: "across",
  });

  const clueNumberGrid = useMemo(
    () => getCellNumbers(workingPuzzle),
    [workingPuzzle]
  );
  const cellClueMaps = useMemo(
    () => getBelongingClueNumbers(clueNumberGrid, workingPuzzle),
    [clueNumberGrid, workingPuzzle]
  );
  const clueNumberToCellLocationMap = useMemo(
    () => createClueNumberToCellLocationMap(clueNumberGrid),
    [clueNumberGrid]
  );

  function updateCrosswordState(updates: Partial<CrosswordState>) {
    setCrosswordState((prev) => ({ ...prev, ...updates }));
  }
  const { cellSize, totalGridHeight } = useMemo(() => {
    const cols = workingPuzzle[0]?.length ?? 0;
    const rows = workingPuzzle.length;
    const size = Math.floor(
      (Math.min(window.innerWidth, window.innerHeight) * 0.9) /
        Math.max(1, cols)
    );
    return { cellSize: size, totalGridHeight: rows * size };
  }, [workingPuzzle]);

  function handleClueClick(number: number, direction: Direction) {
    const newSelectedCellLocation = clueNumberToCellLocationMap[number];
    const clueMap =
      cellClueMaps[newSelectedCellLocation.row][newSelectedCellLocation.col];
    const otherDirectionClueNumber =
      direction === "across"
        ? clueMap.downClueNumber
        : clueMap.acrossClueNumber;
    if (newSelectedCellLocation) {
      updateCrosswordState({
        selectedCell: newSelectedCellLocation,
        activeClue: { number, direction },
        direction: direction,
        otherDirectionClueNumber: otherDirectionClueNumber,
      });
    }
  }
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
        cellClueMaps={cellClueMaps}
        clueNumberGrid={clueNumberGrid}
        crosswordState={crosswordState}
        updateCrosswordState={updateCrosswordState}
      />
      <Clues
        clues={clues}
        onClick={handleClueClick}
        crosswordState={crosswordState}
        updateCrosswordState={updateCrosswordState}
      />
    </div>
  );
}

export default CrosswordPage;
