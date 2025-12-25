const blockedCellChars = ["#", ".", "*"];
function isBlockedCellChar(char: string): boolean {
  return blockedCellChars.includes(char);
}
export { isBlockedCellChar };
