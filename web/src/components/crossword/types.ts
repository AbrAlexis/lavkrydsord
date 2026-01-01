export type CellProps = {
  value: string;
  isBlocked: boolean;
  isSelected: boolean;
  isHighlighted?: boolean;
  number?: number | null;
  acrossClueNumber: number | null;
  downClueNumber: number | null;
  onClick: () => void;
};

export type CrosswordProps = {
  workingPuzzle: string[][];
  cellSize: number;
  clueNumberGrid: (number | null)[][];
  cellClueMaps: cellClueMapping[][];
  gridValues: CellValue[][];
  crosswordState: CrosswordState;
  updateCrosswordState: (updates: Partial<CrosswordState>) => void;
};

export type CluesProps = {
  clues: Clue[];
  onClick: (key: number, clueDirection: Direction) => void;
  crosswordState: CrosswordState;
  updateCrosswordState: (updates: Partial<CrosswordState>) => void;
};

export type ClueComponentProps = {
  number: number;
  direction: string;
  text: string;
  isHighlighted: boolean;
  isOtherDirectionHighlighted: boolean;
  onClick?: () => void;
};
export type Clue = {
  Orientation: "A" | "D";
  Number: number;
  Clue: string;
};

export type PuzzleData = {
  MetaData: string[];
  WorkingPuzzle: string[][];
  Clues: Clue[];
};

export type cellClueMapping = {
  acrossClueNumber: number | null;
  downClueNumber: number | null;
};

export type Direction = "across" | "down";

export type CrosswordState = {
  selectedCell: { row: number; col: number } | null;
  activeClue: ActiveClue | null;
  otherDirectionClueNumber: number | null;
  direction: "across" | "down";
};

export type CellValue = string;

export type ActiveClue = {
  number: number | null;
  direction: "across" | "down" | null;
};
