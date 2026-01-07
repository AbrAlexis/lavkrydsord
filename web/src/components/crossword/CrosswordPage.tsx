import Crossword from "./components/Crossword";
import Clues from "./components/clues/Clues.tsx";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { isArrowKey } from "../../constants/BlockedCellChars.ts";
import type {
  PuzzleData,
  Clue,
  CrosswordState,
  Direction,
  CellValue,
} from "./types.ts";
import "./CrosswordPage.css";
import {
  getCellNumbers,
  getBelongingClueNumbers,
  createClueNumberToCellLocationMap,
  nextCell,
  previousCell,
  getActiveClue,
  flipDirection,
  getNextCellArrowKey,
} from "../../services/puzzleServices.ts";
import { isBlockedCellChar } from "../../constants/BlockedCellChars.ts";
import ActiveClueDisplayer from "./components/clues/ActiveClueDisplayer.tsx";

function CrosswordPage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const id = Number(puzzleId);
  const [workingPuzzle, setWorkingPuzzle] = useState<string[][]>([]);
  const [clues, setClues] = useState<Clue[]>([]);
  const [gridValues, setGridValues] = useState<CellValue[][]>([]);

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

  useEffect(() => {
    if (workingPuzzle.length > 0) {
      setGridValues(workingPuzzle);
    }
  }, [workingPuzzle]);

  // should probably find a better parameter name
  function moveCell(direction: string) {
    if (crosswordState.selectedCell === null) return;
    if (direction === "next") {
      const next = nextCell(
        crosswordState.selectedCell,
        workingPuzzle,
        crosswordState.direction
      );
      if (next) {
        updateCrosswordState({ selectedCell: next });
      }
    } else if (direction === "previous") {
      const previous = previousCell(
        crosswordState.selectedCell,
        workingPuzzle,
        crosswordState.direction
      );
      if (previous) {
        updateCrosswordState({ selectedCell: previous });
      }
    }
  }

  function writeLetter(letter: CellValue) {
    if (crosswordState.selectedCell === null) return;
    const { row, col } = crosswordState.selectedCell;
    const newGridValues = [...gridValues];
    newGridValues[row][col] = letter.toUpperCase();
    setGridValues(newGridValues);
    moveCell("next");
  }

  function deleteLetter() {
    if (crosswordState.selectedCell === null) return;
    const { row, col } = crosswordState.selectedCell;
    const newGridValues = [...gridValues];
    switch (crosswordState.direction) {
      case "across":
        if (
          !isBlockedCellChar(newGridValues[row][col]) &&
          newGridValues[row][col] !== ""
        ) {
          newGridValues[row][col] = "";
        } else if (col > 0 && !isBlockedCellChar(newGridValues[row][col - 1])) {
          newGridValues[row][col - 1] = "";
          moveCell("previous");
        }
        break;
      case "down":
        if (
          !isBlockedCellChar(newGridValues[row][col]) &&
          newGridValues[row][col] !== ""
        ) {
          newGridValues[row][col] = "";
        } else if (row > 0 && !isBlockedCellChar(newGridValues[row - 1][col])) {
          newGridValues[row - 1][col] = "";
          moveCell("previous");
        }
        break;
    }

    setGridValues(newGridValues);
  }

  useEffect(() => {
    function handleKeyPressed(e: KeyboardEvent) {
      if (crosswordState.selectedCell === null) {
        return;
      }

      const writeLocation = crosswordState.selectedCell;

      if (!writeLocation) return;

      if (e.key === "Backspace") {
        console.log("Backspace pressed");
        deleteLetter();
        return;
      }
      if (e.key == " ") {
        e.preventDefault();
        console.log("Space pressed");
        const newDirection = flipDirection(crosswordState.direction);
        const newActiveClue = getActiveClue(
          writeLocation,
          cellClueMaps,
          newDirection
        );
        updateCrosswordState({
          direction: newDirection,
          activeClue: newActiveClue,
        });
      }
      if (isArrowKey(e.key)) {
        e.preventDefault();
        const newSelectedCell = getNextCellArrowKey(
          e.key,
          writeLocation,
          workingPuzzle
        );
        const newActiveClue = getActiveClue(
          newSelectedCell,
          cellClueMaps,
          crosswordState.direction
        );
        updateCrosswordState({
          selectedCell: newSelectedCell,
          activeClue: newActiveClue,
        });
      }

      // should add danish and other languages letters at some point
      if (/^[A-Za-z]$/.test(e.key)) {
        writeLetter(e.key);
      }
    }
    window.addEventListener("keydown", handleKeyPressed);
    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [crosswordState.selectedCell, crosswordState.direction, gridValues]);

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
        gridValues={gridValues}
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
