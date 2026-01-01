const blockedCellChars = ["#", ".", "*"];
export function isBlockedCellChar(char: string): boolean {
  return blockedCellChars.includes(char);
}

const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export function isArrowKey(key: string): boolean {
  return arrowKeys.includes(key);
}
