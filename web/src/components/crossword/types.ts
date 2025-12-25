export type CellProps = {
  value: string;
  isBlocked: boolean;
  isSelected: boolean;
  onClick: () => void;
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
