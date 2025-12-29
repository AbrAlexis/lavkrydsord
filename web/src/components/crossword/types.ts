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
  activeClue: {
    direction: "across" | "down";
    number: number;
  } | null;
  setActiveClue: (
    clue: { direction: "across" | "down"; number: number } | null
  ) => void;
  setOtherDirectionClueNumber: (num: number | null) => void;
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
