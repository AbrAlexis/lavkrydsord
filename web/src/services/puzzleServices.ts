export function flipDirection(direction: "across" | "down"): "down" | "across" {
  return direction === "across" ? "down" : "across";
}